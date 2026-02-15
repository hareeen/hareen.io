import type { Root, RootContent } from "hast";

export default function rehypeResponsiveMermaid() {
  return (tree: Root) => {
    tree.children = tree.children.map(replace);
  };
}

function replace<T extends RootContent>(element: T): T {
  if (
    element.type === "element" &&
    element.tagName === "picture" &&
    hasTwoElements(element.children) &&
    element.children[0].type === "element" &&
    element.children[0].children.length === 0 &&
    element.children[0].tagName === "source" &&
    element.children[1].type === "element" &&
    element.children[1].children.length === 0 &&
    element.children[1].tagName === "img"
  ) {
    const {
      srcset: dark,
      media: _,
      class: darkClass,
      ...darkProperties
    } = element.children[0].properties;
    const {
      src: light,
      class: lightClass,
      ...lightProperties
    } = element.children[1].properties;
    element.children = [
      {
        type: "element",
        tagName: "img",
        children: [],
        properties: {
          ...darkProperties,
          src: dark,
          class: darkClass,
        },
      },
      {
        type: "element",
        tagName: "img",
        children: [],
        properties: {
          ...lightProperties,
          src: light,
          class: lightClass,
        },
      },
    ];
  }
  if (element.type === "element")
    element.children = element.children.map(replace);
  return element;
}

function hasTwoElements<T>(l: T[]): l is [T, T] {
  return l.length === 2;
}
