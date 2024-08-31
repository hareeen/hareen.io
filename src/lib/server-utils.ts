import { type Dree, SortMethodPredefined, Type, scanAsync } from 'dree';
import fm from 'front-matter';
import type { FrontMatter } from './types';

export type PostMeta = Pick<Dree, 'name' | 'relativePath'> & {
  type: Type.FILE;
  frontmatter: FrontMatter;
};

export type PostDirectory = Pick<Dree, 'name' | 'relativePath'> & {
  type: Type.DIRECTORY;
  children: PostTree[];
};

export type PostTree = PostDirectory | PostMeta;

export async function checkIfPostExists(slug: string[]) {
  const file = Bun.file(`${process.cwd()}/src/components/posts/${slug.join('/')}.mdx`);
  return file.exists();
}

export async function parsePostTree(slug: string[]) {
  async function transformTree(current: Dree): Promise<PostTree> {
    if (current.type === Type.FILE) {
      const file = Bun.file(current.path);
      const frontmatter = fm<FrontMatter>(await file.text()).attributes;

      return {
        name: current.name,
        relativePath: current.relativePath,
        type: Type.FILE,
        frontmatter,
      };
    }
    return {
      name: current.name,
      relativePath: current.relativePath,
      type: Type.DIRECTORY,
      children: await Promise.all((current.children ?? []).map((child) => transformTree(child))),
    };
  }

  try {
    const path = `${process.cwd()}/src/components/posts/${slug.join('/')}`;
    return await transformTree(await scanAsync(path, { sorted: SortMethodPredefined.ALPHABETICAL }));
  } catch {
    return null;
  }
}

export function postTreeTraversal(pt: PostTree, depth = 0, containSelf = false): { pt: PostTree; depth: number }[] {
  let result: ReturnType<typeof postTreeTraversal> = [];

  if (containSelf) {
    result.push({ pt, depth });
  }

  if (pt.type === Type.DIRECTORY) {
    let subDirExists = false;

    for (const child of pt.children ?? []) {
      subDirExists = child.type === Type.DIRECTORY || subDirExists;
      result = [...result, ...postTreeTraversal(child, depth + 1, true)];
    }

    if (!subDirExists) {
      result.sort((lhs, rhs) => {
        if (lhs.depth !== rhs.depth) {
          return lhs.depth - rhs.depth;
        }
        if (lhs.pt.type === Type.FILE && rhs.pt.type === Type.FILE) {
          return rhs.pt.frontmatter.date.getTime() - lhs.pt.frontmatter.date.getTime();
        }
        throw new Error();
      });
    }
  }

  return result;
}
