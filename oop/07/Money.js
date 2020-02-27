// @ts-check
export default function Money(value, currency = 'usd') {
	this.value = value;
	this.currency = currency;
}

Money.prototype = Object.create(Money.prototype);

Money.exchanges = {
	"usd": (value) => value * 1.2,
	"eur": (value) => value * 0.7
};

Money.symbols = {
	"usd": "$",
	"eur": "€"
};

Money.prototype.getValue = function () {
	return this.value;
};

Money.prototype.exchangeTo = function (currency) {
	const value = Money.exchanges[currency](this.getValue());
	return new Money(value, currency);
};

Money.prototype.add = function (money) {
	const {
		currency
	} = money;
	if (currency !== this.currency) {
		const convertedMoney = money.exchangeTo(this.currency);
		return new Money(convertedMoney.getValue() + this.getValue(), this.currency);
	} else {
		return new Money(this.getValue() + money.getValue(), this.currency);
	}
};

Money.prototype.format = function format() {
	return this.getValue().toLocaleString(undefined, {
		style: 'currency',
		currency: this.currency
	});
};