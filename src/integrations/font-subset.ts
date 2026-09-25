import { createReadStream } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { decodeHTML } from "entities";
import subsetFont from "subset-font";

interface FontSubsetOptions {
  /** The full font, kept outside `public/` so it never ships as-is. */
  source: URL;
  /** Where the site requests the font, e.g. from an `@font-face` rule. */
  publicPath: string;
}

const SCANNED_EXTENSIONS = new Set([".html", ".js", ".css"]);

/**
 * Serves the full font in dev and, after a build, replaces it with a subset holding only the characters the built site contains.
 */
export default function fontSubset({
  source,
  publicPath,
}: FontSubsetOptions): AstroIntegration {
  return {
    name: "font-subset",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(publicPath, (_req, res, next) => {
          res.setHeader("Content-Type", "font/woff2");
          createReadStream(source).on("error", next).pipe(res);
        });
      },
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const text = await collectText(outDir);
        const subset = await subsetFont(await readFile(source), text, {
          targetFormat: "woff2",
        });

        const target = path.join(outDir, publicPath);
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, subset);
        logger.info(
          `${publicPath}: ${new Set(text).size} characters, ${Math.round(subset.length / 1024)} KiB`,
        );
      },
    },
  };
}

// Client-side islands carry their UI strings in JS, and CSS may emit text through `content`, so both are scanned alongside HTML.
async function collectText(outDir: string): Promise<string> {
  const files = await readdir(outDir, { recursive: true });
  const chunks = await Promise.all(
    files
      .filter((file) => SCANNED_EXTENSIONS.has(path.extname(file)))
      .map(async (file) => {
        const content = await readFile(path.join(outDir, file), "utf8");
        return file.endsWith(".html") ? decodeHTML(content) : content;
      }),
  );
  return [...new Set(chunks.join(""))].join("");
}
