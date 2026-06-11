// 마네킹 룩 원본 PNG → public/looks/ WebP 일괄 변환 (1회성 빌드 스크립트)
// 사용: node scripts/build-look-images.mjs [원본 디렉터리]
// 규약: 840px 너비, WebP q80 — docs/UI_GUIDE.md "정적 룩 이미지 파이프라인" 참조
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DEFAULT_INPUT =
  "c:/Users/sjs18/Documents/Codex/2026-06-09/ai-3d-5/outputs/ai-lookbook-3d-mannequin-looks";
const inputDir = process.argv[2] ?? DEFAULT_INPUT;
const outputDir = path.join(import.meta.dirname, "..", "public", "looks");

await mkdir(outputDir, { recursive: true });

const files = (await readdir(inputDir)).filter((f) => f.toLowerCase().endsWith(".png"));
if (files.length === 0) {
  console.error(`PNG 원본이 없습니다: ${inputDir}`);
  process.exit(1);
}

for (const file of files.sort()) {
  const slug = path.basename(file, path.extname(file));
  const outPath = path.join(outputDir, `${slug}.webp`);
  await sharp(path.join(inputDir, file))
    .resize({ width: 840, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(outPath);
  const { size } = await stat(outPath);
  console.log(`${slug}.webp — ${Math.round(size / 1024)} KB`);
}
