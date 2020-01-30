//@ts-check
export default function toLowerCse (tree) {
   const { name: fileName, type, children = [], ...rest } = tree;
   if (type === "file") {
      return { ...rest, type, name: fileName.toLowerCase(), }
   }
   return { ...rest, name: fileName, type, children: children.map(toLowerCse) };
};