// @ts-check

import Cart from '../Cart.js';

test('Cart', () => {
    const cart = new Cart();
    expect(cart.getItems()).toHaveLength(0);

    cart.addItem({
        name: 'car',
        price: 3
    }, 5);
    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getCost()).toBe(15);
    expect(cart.getCount()).toBe(5);

    cart.addItem({
        name: 'house',
        price: 10
    }, 2);
    expect(cart.getItems()).toHaveLength(2);
    expect(cart.getCost()).toBe(35);
    expect(cart.getCount()).toBe(7);
});