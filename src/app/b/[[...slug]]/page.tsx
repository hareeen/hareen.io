import { Directory } from '@/components/layout/Directory';
import { MainLayout } from '@/components/layout/MainLayout';
import { Post } from '@/components/layout/Post';
import { checkIfPostExists } from '@/lib/server-utils';
import type { FrontMatter } from '@/lib/types';
import type { Metadata } from 'next';

export async function generateMetadata(
  props: {
    params: Promise<{
      slug?: string[];
    }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const isPost = await checkIfPostExists(slug);

  if (isPost) {
    const { frontmatter } = (await import(`@/components/posts/${slug.join('/')}.mdx`)) as {
      frontmatter: FrontMatter;
    };
    frontmatter.date = new Date(frontmatter.date);

    return {
      title: frontmatter.title,
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
      title: `blog - ${slug[slug.length - 1]}`,
      openGraph: {
        title: `blog - ${slug[slug.length - 1]}`,
      },
      twitter: {
        title: `blog - ${slug[slug.length - 1]}`,
      },
    };
  }

  return {};
}

export default async function PostPage(
  props: {
    params: Promise<{ slug?: string[] }>;
  }
) {
  const params = await props.params;
  const slug = params.slug ?? [];

  const isPost = await checkIfPostExists(slug);

  return <MainLayout>{isPost ? <Post slug={slug} /> : <Directory slug={slug} />}</MainLayout>;
}
