/**
 * Patch magic-string package.json so Node ESM can resolve
 * "magic-string/dist/magic-string.es.mjs" (used by vitest and others).
 * The package only exports "." so subpath imports fail without this.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(__dirname, "../node_modules/magic-string/package.json");

function main() {
  if (!fs.existsSync(pkgPath)) return;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (!pkg.exports) return;
  const subpath = "./dist/magic-string.es.mjs";
  if (pkg.exports[subpath]) return;
  pkg.exports[subpath] = subpath;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("patched magic-string exports for", subpath);
}
main();
