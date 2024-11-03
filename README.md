# Finance Manager Progressive Web App

Finance Manager is a Progressive Web Application (PWA) that helps you track your income, expenses, and savings efficiently. With powerful categorization, filtering, and reporting features, this app provides you with clear insights into your financial habits, supporting informed decision-making and better financial health.

## Features

### Core Functionalities
- **Income, Expense, and Savings Tracking**: Record and manage your finances, categorizing entries to keep track of where your money goes.
- **Categorization**: Organize transactions into categories for easy sorting and reporting.
- **Multi-Account Support**: Track transactions across various accounts (e.g., bank, credit card, cash).

### Advanced Capabilities
- **Filtering Options**:
  - **By Payee**: Filter transactions by payee to understand spending by recipient.
  - **By Account**: View transactions specific to an account for detailed tracking.
  - **By Category**: Filter by category for insights into specific spending areas.
- **Search**:
  - **Search Categories**: Quickly find specific categories to analyze or update.
- **Custom Reports**:
  - **Date-Range Reports**: Generate reports for transactions within a selected date range for budgeting, tax preparation, or personal reviews.
- **Charts and Visual Insights**: Gain insights through visualizations of spending patterns by category and time frame.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) with TypeScript, [Tailwind CSS](https://tailwindcss.com/), [Shadcn](https://shadcn.dev/) for UI components
- **Backend**: [Hono](https://hono.dev/) for backend logic with Next.js API routes
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/) for seamless type-safe database interactions
- **Authentication**: [Clerk](https://clerk.dev/) for secure user authentication
- **Validation**: [Zod](https://github.com/colinhacks/zod) for schema validation
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) for lightweight, flexible state management
- **Data Fetching**: [React Query](https://tanstack.com/query/v3/) for efficient data fetching and client-side caching

## Installation

1. **Clone the Repository**:
   ```bash
   git clone repo-link
   cd Finance-Manager

2. **Install Dependencies**:
   ```bash
   pnpm install

3. **Create Environment Variables**:
    ```bash
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key

    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    DATABASE_URL=your_postgresql_database_url

    NEXT_PUBLIC_APP_URL=http://localhost:3000

4. **Run the Development Server**
    ```bash
    pnpm dev    
