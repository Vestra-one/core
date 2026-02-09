/**
 * Generates a sample invoice PDF that the app's invoice parser can read.
 * Run: node scripts/generate-sample-invoice.mjs
 * Output: public/sample-invoice.pdf
 *
 * The PDF contains only the three fields we parse:
 * 1. Recipient chain
 * 2. Recipient address
 * 3. Amount (with token denom, e.g. 1000 USDC)
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "sample-invoice.pdf");

async function main() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  let y = 750;

  const draw = (text) => {
    page.drawText(text, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
    y -= fontSize * 1.4;
  };

  draw("Sample Invoice — Vestra Payments");
  draw("Include these three fields so Upload Invoice can parse them:");
  y -= 8;
  draw("1. Recipient chain");
  draw("2. Recipient address");
  draw("3. Amount (with token, e.g. 1000 USDC)");
  y -= 24;

  draw("——— Payment 1 ———");
  draw("Recipient chain: Ethereum");
  draw("Recipient address: 0x4f3b892123456789012345678901234567890e92");
  draw("Amount: 1000 USDC");
  y -= 20;

  draw("——— Payment 2 ———");
  draw("Recipient chain: Polygon");
  draw("Recipient address: 0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
  draw("Amount: 500 MATIC");
  y -= 20;

  draw("——— Payment 3 ———");
  draw("Recipient chain: Arbitrum");
  draw("Recipient address: 0x71C21BF1d32708136C185A0CEBAE72E042733A2");
  draw("Amount: 1.5 ETH");

  const bytes = await doc.save();
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, bytes);
  console.log("Wrote", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
