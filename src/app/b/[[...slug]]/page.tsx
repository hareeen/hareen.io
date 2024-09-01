import { Directory } from '@/components/layout/Directory';
import { MainLayout } from '@/components/layout/MainLayout';
import { Post } from '@/components/layout/Post';
import { checkIfPostExists } from '@/lib/server-utils';
import type { FrontMatter } from '@/lib/types';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: {
    slug?: string[];
  };
}): Promise<Metadata> {
  const slug = params.slug ?? [];
  const isPost = await checkIfPostExists(slug);

  if (isPost) {
    const { frontmatter } = (await import(`@/components/posts/${slug.join('/')}.mdx`)) as {
      frontmatter: FrontMatter;
    };
    frontmatter.date = new Date(frontmatter.date);

    return {
      openGraph: {
        type: 'article',
        title: frontmatter.title,
        description: frontmatter.description,
      },
      twitter: {
        title: frontmatter.title,
        description: frontmatter.description,
      },
    };
  }
  if (slug.length > 0) {
    return {
      openGraph: {
        title: slug[slug.length - 1],
      },
      twitter: {
        title: slug[slug.length - 1],
      },
    };
  }

  return {};
}

export default async function PostPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = params.slug ?? [];

  const isPost = await checkIfPostExists(slug);

  return <MainLayout>{isPost ? <Post slug={slug} /> : <Directory slug={slug} />}</MainLayout>;
}
