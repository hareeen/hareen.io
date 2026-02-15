// @ts-check

import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import remarkMath from "remark-math";
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import rehypeResponsiveMermaid from "./src/plugins/rehype-responsive.mermaid";

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  defaultLang: 'plaintext',
};

/** @type {import('rehype-mermaid').RehypeMermaidOptions} */
const rehypeMermaidOptions = {
  strategy: 'img-svg',
  dark: true,
};

// https://astro.build/config
export default defineConfig({
  site: 'https://hareen.io',

  vite: {
    plugins: [tailwindcss(), svgr()],
  },

  integrations: [mdx(), react()],

  markdown: {
    gfm: true,
    syntaxHighlight: false,
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeMermaid, rehypeMermaidOptions],
      [rehypePrettyCode, rehypePrettyCodeOptions],
      rehypeResponsiveMermaid,
      rehypeKatex
    ],
  }
});
