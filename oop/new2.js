function New(func) {
	const obj = {};
	func.bind(obj)(Array.prototype.slice.call(arguments, 1));
	return obj;
}

function Animal(name) {
	this.name = name;
}


const dog = New(Animal, "dog");
console.log(dog.name); // dog