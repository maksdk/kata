function New(func) {
	const obj = {};
	
	if (func.prototype !== null) {
		obj.__proto__ = func.prototype;
	}

	const result = func.apply(obj, Array.prototype.slice(arguments, 1));

	if ((typeof result === "object" || typeof result === "function") && result !== null) {
		return result;
	}

	return obj;
}

function Animal(name) {
	this.name = name;
}

const dog = New(Animal, "vasya");
console.log(dog.name);