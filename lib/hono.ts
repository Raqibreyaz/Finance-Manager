import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

// assume it contains the base url
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
