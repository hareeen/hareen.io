import type { CollectionEntry } from "astro:content";

export type TreeNode = {
  name: string;
  type: "directory" | "file";
  slug: string;
  title?: string;
  date?: Date;
  children: TreeNode[];
};

export type FlatEntry = { node: TreeNode; depth: number };

export function buildTree(posts: CollectionEntry<"posts">[]): TreeNode {
  const root: TreeNode = {
    name: "~",
    type: "directory",
    slug: "",
    children: [],
  };

  for (const post of posts) {
    const parts = post.id.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        current.children.push({
          name: part,
          type: "file",
          slug: post.id,
          title: post.data.title,
          date: post.data.date,
          children: [],
        });
      } else {
        let dir = current.children.find(
          (c) => c.name === part && c.type === "directory",
        );
        if (!dir) {
          dir = {
            name: part,
            type: "directory",
            slug: parts.slice(0, i + 1).join("/"),
            children: [],
          };
          current.children.push(dir);
        }
        current = dir;
      }
    }
  }

  return root;
}

export function findSubtree(
  root: TreeNode,
  slugParts: string[],
): TreeNode | null {
  let current = root;
  for (const part of slugParts) {
    const child = current.children.find(
      (c) => c.name === part && c.type === "directory",
    );
    if (!child) return null;
    current = child;
  }
  return current;
}

export function flatten(node: TreeNode, depth: number = 0): FlatEntry[] {
  const result: FlatEntry[] = [];

  const sorted = [...node.children].sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    if (a.type === "file" && b.type === "file" && a.date && b.date) {
      return b.date.getTime() - a.date.getTime();
    }
    return a.name.localeCompare(b.name);
  });

  for (const child of sorted) {
    result.push({ node: child, depth });
    if (child.type === "directory") {
      result.push(...flatten(child, depth + 1));
    }
  }
  return result;
}

/** Collect all directory slugs from the tree */
export function collectDirectorySlugs(node: TreeNode): string[] {
  const slugs: string[] = [];
  for (const child of node.children) {
    if (child.type === "directory") {
      slugs.push(child.slug);
      slugs.push(...collectDirectorySlugs(child));
    }
  }
  return slugs;
}
