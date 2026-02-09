/**
 * Invoice parse: upload PDF, extract payment line items (recipient chain, address, amount with token).
 * Returns a structured list for the frontend to merge into payment forms.
 */

import { Router, type Request, type Response } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/x-pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    if (ok) cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

type RequestWithFile = Request & { file?: Express.Multer.File & { buffer?: Buffer } };

/** Parsed line: the three fields we care about — recipient chain, recipient address, amount with token. */
export type ParsedInvoiceLine = {
  chain?: string;
  address: string;
  amount: string;
  currency: string;
  description?: string;
};

export type InvoiceParseResponse = {
  lines: ParsedInvoiceLine[];
};

const EVM_ADDRESS_REGEX = /0x[a-fA-F0-9]{40}/g;
const NEAR_ACCOUNT_REGEX = /[a-zA-Z0-9._-]{2,64}\.(?:near|testnet)/g;
const AMOUNT_REGEX = /(\d{1,20}(?:[.,]\d+)?)\s*([A-Za-z]{2,10})?/g;

/** Known chain names (display labels) we look for in the PDF. */
const KNOWN_CHAIN_NAMES = [
  "Ethereum",
  "Polygon",
  "Arbitrum",
  "Base",
  "Optimism",
  "NEAR",
  "Solana",
  "BNB Chain",
  "Avalanche",
  "Gnosis",
  "Starknet",
  "Sui",
  "TON",
  "X Layer",
  "Monad",
  "Berachain",
];

function findChainInText(text: string, aroundIndex: number, window = 300): string | undefined {
  const start = Math.max(0, aroundIndex - window);
  const end = Math.min(text.length, aroundIndex + window);
  const slice = text.slice(start, end);
  for (const name of KNOWN_CHAIN_NAMES) {
    if (new RegExp(name.replace(/\s+/g, "\\s+"), "i").test(slice)) return name;
  }
  return undefined;
}

/**
 * Heuristic extraction: find addresses (EVM or NEAR), nearby amounts/currencies, and chain name.
 * Parses the three fields: recipient chain, recipient address, amount (with token).
 */
function extractLinesFromText(text: string): ParsedInvoiceLine[] {
  const lines: ParsedInvoiceLine[] = [];
  const seen = new Set<string>();

  const evmMatches = [...text.matchAll(EVM_ADDRESS_REGEX)];
  const nearMatches = [...text.matchAll(NEAR_ACCOUNT_REGEX)];
  const allAddresses = [
    ...evmMatches.map((m) => m[0]),
    ...nearMatches.map((m) => m[0]),
  ].filter((a) => !seen.has(a) && seen.add(a));

  if (allAddresses.length === 0) {
    const amountMatches = [...text.matchAll(AMOUNT_REGEX)];
    if (amountMatches.length > 0) {
      for (const m of amountMatches) {
        const amount = m[1].replace(",", ".");
        const currency = (m[2] || "USDC").toUpperCase();
        if (Number.isFinite(Number(amount)) && Number(amount) > 0) {
          lines.push({ address: "", amount, currency });
        }
      }
    }
    return lines;
  }

  const chunks = text.split(/\s+/);
  for (const address of allAddresses) {
    const pos = text.indexOf(address);
    const chain = findChainInText(text, pos, 350);
    let amount = "";
    let currency = "USDC";
    const idx = chunks.findIndex((c) => c.includes(address) || c === address);
    if (idx >= 0) {
      for (let i = idx + 1; i < Math.min(idx + 5, chunks.length); i++) {
        const m = chunks[i].match(/^(\d{1,20}(?:[.,]\d+)?)\s*([A-Za-z]{2,10})?$/);
        if (m) {
          amount = m[1].replace(",", ".");
          if (m[2]) currency = m[2].toUpperCase();
          break;
        }
      }
    }
    if (!amount) {
      const after = text.slice(pos + address.length, pos + 200);
      const am = after.match(/(\d{1,20}(?:[.,]\d+)?)\s*([A-Za-z]{2,10})?/);
      if (am) {
        amount = am[1].replace(",", ".");
        if (am[2]) currency = am[2].toUpperCase();
      }
    }
    if (!amount) amount = "0";
    lines.push({ chain, address, amount, currency });
  }

  return lines;
}

router.post(
  "/parse",
  (req, res, next) => {
    upload.single("file")(req, res, (err: unknown) => {
      if (err) {
        const message = err instanceof Error ? err.message : "File upload failed";
        const code = err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        res.status(code).json({ error: message });
        return;
      }
      next();
    });
  },
  async (req: Request, res: Response): Promise<void> => {
    const file = (req as RequestWithFile).file;
    if (!file?.buffer) {
      res.status(400).json({ error: "No file uploaded. Use multipart field 'file' with a PDF." });
      return;
    }

    try {
      const parser = new PDFParse({ data: file.buffer });
      const result = await parser.getText();
      const text = typeof result?.text === "string" ? result.text : "";
      const lines = extractLinesFromText(text);

      const response: InvoiceParseResponse = { lines };
      res.json(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse PDF";
      res.status(422).json({ error: message });
    }
  }
);

export default router;
