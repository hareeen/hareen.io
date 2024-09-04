import type { FrontMatter } from '@/lib/types';
import { DateTime } from 'luxon';
import type { MDXContent } from 'mdx/types';
import { headers } from 'next/headers';

import Link from 'next/link';
import { Fragment } from 'react';
import { Comments } from './Comments';
import { ProseArticle } from './ProseArticle';

export async function Post(props: { slug: string[] }) {
  const header = headers();

  const { default: Post, frontmatter } = (await import(`@/components/posts/${props.slug.join('/')}.mdx`)) as {
    default: MDXContent;
    frontmatter: FrontMatter;
  };
  frontmatter.date = new Date(frontmatter.date);

  let subpaths: string[][] = [[]];
  for (const cur of props.slug) {
    subpaths.push([...subpaths[subpaths.length - 1]]);
    subpaths[subpaths.length - 1].push(cur);
  }
  subpaths = subpaths.slice(0, -1);

  return (
    <ProseArticle className="[&>*:nth-child(4)]:mt-0">
      <p className="text-muted-foreground text-sm mb-0 prose-a:no-underline prose-a:text-muted-foreground hover:prose-a:underline">
        {subpaths.map((path) => (
          <Fragment key={`path-link-${path}`}>
            <Link href={`/b/${path.join('/')}`}>{path.length === 0 ? '~' : path[path.length - 1]}</Link>
            {' / '}
          </Fragment>
        ))}
      </p>
      <h1 className="mt-2 mb-0">{frontmatter.title}</h1>
      <p className="text-muted-foreground text-sm mt-2 mb-6 font-medium print:hidden">
        {DateTime.fromJSDate(frontmatter.date)
          .setLocale((header.get('Accept-Language')?.split(',') ?? ['ko-KR'])[0])
          .toLocaleString(DateTime.DATE_MED)}
      </p>
      <Post />
      <Comments />
    </ProseArticle>
  );
}
