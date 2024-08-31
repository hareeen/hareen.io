/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeKatex from 'rehype-katex';
import { createRequire } from 'module';

const require = createRequire(import.meta.url)

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
};

const withMDX = createMDX({
  extension: /\.mdx$/,
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkFrontmatter,
      remarkMdxFrontmatter,
    ],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], rehypeKatex],
  },
});

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

export default withMDX(nextConfig);
