import type { FrontMatter } from '@/lib/types';
import { DateTime } from 'luxon';
import type { MDXContent } from 'mdx/types';
import { headers } from 'next/headers';

import Link from 'next/link';
import { Fragment } from 'react';
import { Comments } from './Comments';
import { ProseArticle } from './ProseArticle';

export async function Post(props: { slug: string[] }) {
  const header = await headers();

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
    <>
      <ProseArticle className="[&>*:nth-child(4)]:mt-0">
        <p className="text-muted-foreground md:text-sm text-xs mb-0 max-md:mb-0 prose-a:no-underline prose-a:text-muted-foreground hover:prose-a:underline">
          {subpaths.map((path) => (
            <Fragment key={`path-link-${path}`}>
              <Link href={`/b/${path.join('/')}`}>{path.length === 0 ? '~' : path[path.length - 1]}</Link>
              {' / '}
            </Fragment>
          ))}
        </p>
        <h1 className="mt-2 max-md:mt-1.5 mb-0 max-md:mb-0 print:mb-2 print:max-md:mb-1.5">{frontmatter.title}</h1>
        <p className="text-muted-foreground md:text-sm text-xs mt-2 max-md:mt-1.5 mb-6 max-md:mb-5 font-medium print:hidden">
          {DateTime.fromJSDate(frontmatter.date)
            .setLocale((header.get('Accept-Language')?.split(',') ?? ['ko-KR'])[0])
            .toLocaleString(DateTime.DATE_MED)}
        </p>
        <Post />
      </ProseArticle>
      <Comments />
    </>
  );
}
