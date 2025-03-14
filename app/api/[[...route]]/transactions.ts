import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { defaultFrom, defaultTo } from "@/constants";
import {
  accounts,
  categories,
  insertTransactionSchema,
  transactions,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { convertAmountFromMilliunits } from "@/lib/utils";

const app = new Hono()
  // getting transactions
  .get(
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

      const data = await db
        // shape of your data
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        // main table
        .from(transactions)
        // accounts as the right table take the selected columns and exclude rows from both with unmatched columns
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        // categories as right table take the selected columns including unmatched columns
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        // applying filter
        .where(
          and(
            // if fetching for a particular account
            accountId ? eq(transactions.accountId, accountId) : undefined,
            // if fetching for a particular category
            categoryId ? eq(transactions.categoryId, categoryId) : undefined,
            // take transactions only of the user's accounts
            eq(accounts.userId, auth.userId),
            // from this date
            gte(transactions.date, startDate),
            // to this date
            lte(transactions.date, endDate)
          )
        )
        // sort the data with newest first
        .orderBy(desc(transactions.date));

      return c.json({
        data: data.map((transaction) => ({
          ...transaction,
          amount: convertAmountFromMilliunits(transaction.amount),
        })),
      });
    }
  )
  // getting a transaction
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing Id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        // will remove the transaction if the accoundId it has not matches with any account
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        // take that particular transaction
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));

      if (!data) return c.json({ error: "Not Found" }, 404);

      return c.json({
        data: { ...data, amount: convertAmountFromMilliunits(data.amount) },
      });
    }
  )
  // adding a transaction
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      // omitting id if user has sent it
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const [data] = await db
        .insert(transactions)
        .values({ id: createId(), ...values })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      // taking all the transactions to delete of the user's --> [{id}]
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId)
            )
          )
      );

      const data = await db
        // using the sub query transaction_to_delete which has the rows to be deleted
        .with(transactionsToDelete)
        // to delete from transactions table
        .delete(transactions)
        //only then when
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({ id: transactions.id });

      return !data
        ? c.json({ error: "Selected Items Not Available" })
        : c.json({ data });
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator("json", z.array(insertTransactionSchema.omit({ id: true }))),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const data = await db
        .insert(transactions)
        .values(values.map((value) => ({ id: createId(), ...value })))
        .returning();

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      // id should be present
      if (!id) return c.json({ error: "Missing id" }, 400);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 400);
      }

      const transactionsToUpdate = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            // take only the accounts of the user
            and(eq(accounts.userId, auth.userId), eq(transactions.id, id))
          )
      );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToUpdate})`
          )
        )
        .returning();

      if (!data) return c.json({ error: "Not found" }, 404);

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      // id should be present
      if (!id) return c.json({ error: "Missing id" }, 400);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 400);
      }

      const transactionToDelete = db.$with("transaction_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)))
      );

      const [deletedTransaction] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionToDelete})`)
        )
        .returning();

      return !deletedTransaction
        ? c.json({ error: "Not found" }, 404)
        : c.json({ success: "successfully deleted transaction" });
    }
  );

export default app;
