import getIn from '../objects';

it('getIn', () => {
    const data = {
        user: 'ubuntu',
        hosts: {
            0: {
                name: 'web1',
            },
            1: {
                name: 'web2',
                null: 3,
                active: false,
            },
        },
    };

    expect(getIn(data, [null])).toBeNull();
    expect(getIn(data, ['undefined'])).toBeNull();
    expect(getIn(data, ['user'])).toEqual('ubuntu');
    expect(getIn(data, ['user', 'ubuntu'])).toBeNull();
    expect(getIn(data, ['hosts', 1, 'name'])).toEqual('web2');
    expect(getIn(data, ['hosts', 5])).toBeNull();
    expect(getIn(data, ['hosts', 0])).toEqual({
        name: 'web1'
    });
    expect(getIn(data, ['hosts', 1, null])).toEqual(3);
    expect(getIn(data, ['user', 'name', 'name'])).toBeNull();
    expect(getIn(data, ['hosts', 1, 'active'])).toBe(false);
});