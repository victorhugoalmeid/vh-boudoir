// tools/build-portfolio.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "../assets/portfolio_src");
const OUT_DIR = path.resolve(__dirname, "../public/portfolio");
const DATA_FILE = path.resolve(__dirname, "../src/portfolio.data.ts");

const TARGET_WIDTH = 1400;
const QUALITY = 82;
const EFFORT = 5;

const exts = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const toPosix = (p) => p.split(path.sep).join("/");
const titleCase = (s) =>
  s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (m) => m.toUpperCase());
const safeAlt = (s) =>
  s.replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }); }
async function* walk(dir) {
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const d of list) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function build() {
  const items = [];
  await ensureDir(OUT_DIR);
  try { await fs.access(SRC_DIR); }
  catch { console.error(`❌ Crie ${SRC_DIR} e adicione suas fotos.`); process.exit(1); }

  for await (const file of walk(SRC_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (!exts.has(ext)) continue;

    const rel = path.relative(SRC_DIR, file);
    const dir = path.dirname(rel);
    const base = path.basename(file, ext);
    const category = dir === "." ? "Diversos" : dir;
    const alt = safeAlt(base);

    const outFolder = path.join(OUT_DIR, category);
    const outName = `${base}.webp`;
    const outPath = path.join(outFolder, outName);
    await ensureDir(outFolder);

    const img = sharp(file, { failOn: "none" }).rotate();
    const meta = await img.metadata();
    const width = meta.width || TARGET_WIDTH;
    const resizeTo = Math.min(width, TARGET_WIDTH);

    await img.resize({ width: resizeTo, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: EFFORT })
      .toFile(outPath);

    const publicRel = toPosix(path.relative(path.resolve(__dirname, "../public"), outPath));
    items.push({ src: publicRel, alt: titleCase(alt), category });
    console.log(`✓ ${rel} → ${toPosix(path.relative(SRC_DIR, outPath))}`);
  }

  items.sort((a, b) => a.category.localeCompare(b.category, "pt-BR") || a.src.localeCompare(b.src, "pt-BR"));

  const header =
`// ⚠️ Gerado por tools/build-portfolio.mjs
export type PortfolioItem = { src: string; alt: string; category: string };
export const PORTFOLIO: PortfolioItem[] = [
`;
  const body = items.map(i => `  { src: ${JSON.stringify(i.src)}, alt: ${JSON.stringify(i.alt)}, category: ${JSON.stringify(i.category)} },`).join("\n");
  const footer = `\n];\n`;

  await fs.writeFile(DATA_FILE, header + body + footer, "utf8");
  console.log(`\n✨ Gerado: ${toPosix(path.relative(process.cwd(), DATA_FILE))} (${items.length} itens)`);
}
build().catch((e) => { console.error(e); process.exit(1); });
