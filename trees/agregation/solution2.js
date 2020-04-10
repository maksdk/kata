export default (tree) => {
	const iter = (node, acc) => {
		const name = getName(node);
		if (isFile(node)) {
			return name.startsWith('.') ? acc + 1 : acc;
		}

		const children = getChildren(node);
		const hiddenFilesCounts = children.map((child) => iter(child, 0));
		return acc + _.sum(hiddenFilesCounts);
	};

	return iter(tree, 0);
};