const isHidden = (filename) => {
	const [first] = filename.split('');
	return first === '.';
};

const getHiddenFilesCount = (tree) => {
	const iter = (node, acc) => {
		if (isFile(node)) {
			if (isHidden(getName(node))) {
				return acc + 1;
			}
			return acc;
		}

		const children = getChildren(node);
		const hiddenFiles = children.map((child) => iter(child, 0));
		return acc + _.sum(hiddenFiles);
	};

	return iter(tree, 0);
};

export default getHiddenFilesCount;