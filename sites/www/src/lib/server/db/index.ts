import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "$env/static/private";
import { createClient } from "@libsql/client/web";

export const db = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});