import { db } from "@/db/drizzle";
import { defaultFrom, defaultTo } from "@/constants";
import { accounts, categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
      categoryId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { accountId, categoryId, from, to } = c.req.valid("query");

    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;

    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    // take all the income, expense and savings in the specified date range
    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ) {
      return await db
        //   sum adds amount of every row to a single value
        .select({
          // all the positive values comes in income
          income:
            sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          // every negative value comes in expense
          expenses:
            sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          // the amount left after all expense from the saved money
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            categoryId ? eq(transactions.categoryId, categoryId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        );
    }

    const [currentPeriod] = await fetchFinancialData(
      auth.userId,
      startDate,
      endDate
    );
    const [lastPeriod] = await fetchFinancialData(
      auth.userId,
      lastPeriodStart,
      lastPeriodEnd
    );

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income
    );

    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );

    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    // take all the categories with the expenses in the given specified range
    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce((sum, { value }) => sum + value, 0);

    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({ name: "Other", value: otherSum });
    }

    // take all the days in which income or expense is done with the given specified range
    const activeDays = await db
      .select({
        date: transactions.date,
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          categoryId ? eq(transactions.categoryId, categoryId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    // add the gap of days where there is no income or expense
    const days = fillMissingDays(activeDays, startDate, endDate);

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        days,
      },
    });
  }
);

export default app;
