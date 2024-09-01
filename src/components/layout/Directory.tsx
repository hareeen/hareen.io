import { parsePostTree, postTreeTraversal } from '@/lib/server-utils';
import { ArchiveIcon, FileTextIcon } from '@radix-ui/react-icons';
import { Type } from 'dree';
import { DateTime } from 'luxon';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { ProseArticle } from './ProseArticle';

export async function Directory(props: { slug: string[] }) {
  const header = headers();

  const postTree = await parsePostTree(props.slug);

  if (postTree === null || postTree.type !== Type.DIRECTORY) {
    return notFound();
  }

  const traversal = postTreeTraversal(postTree);

  const subpaths: string[][] = [[]];
  for (const cur of props.slug) {
    subpaths.push([...subpaths[subpaths.length - 1]]);
    subpaths[subpaths.length - 1].push(cur);
  }

  return (
    <ProseArticle>
      <table className="mt-4">
        <thead className="prose-th:text-left">
          <tr>
            <th>
              <span className="prose-a:no-underline hover:prose-a:underline">
                {subpaths.map((path, idx) => (
                  <Fragment key={`path-link-${path}`}>
                    <Link href={`/b/${path.join('/')}`}>{path.length === 0 ? '~' : path[path.length - 1]}</Link>
                    {idx !== subpaths.length - 1 && ' / '}
                  </Fragment>
                ))}
              </span>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {traversal.map(({ pt, depth }) => {
            const slug_inner = [...props.slug, pt.relativePath.split('.')[0]];
            const Icon = pt.type === Type.DIRECTORY ? ArchiveIcon : FileTextIcon;
            const title = pt.type === Type.DIRECTORY ? pt.name : pt.frontmatter.title;

            return (
              <tr key={`row-${pt.relativePath}`}>
                <td>
                  <Link href={`/b/${slug_inner.join('/')}`}>
                    <Icon className="inline-block mr-2" style={{ marginLeft: `${1.5 * (depth - 1)}rem` }} />
                    {title}
                  </Link>
                </td>
                <td className="text-right">
                  {pt.type === Type.FILE &&
                    DateTime.fromJSDate(pt.frontmatter.date)
                      .setLocale((header.get('Accept-Language')?.split(',') ?? ['ko-KR'])[0])
                      .toLocaleString(DateTime.DATE_MED)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {traversal.length === 0 && (
        <div className="md:text-sm text-xs w-full text-center text-muted-foreground mb-12">이곳엔 아무것도 없어요!</div>
      )}
    </ProseArticle>
  );
}
