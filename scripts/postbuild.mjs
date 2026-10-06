// Make `.next/standalone` runnable on its own (`npm start`), as in the Docker image:
// the standalone server expects static assets and public files next to it.
import { cpSync, existsSync } from "node:fs";

if (existsSync(".next/standalone")) {
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
  cpSync("public", ".next/standalone/public", { recursive: true });
}
