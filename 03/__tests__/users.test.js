//@ts-check
import makeUser from '../user';
import getMutualFriends from '../users';

test('getMutualFriends', () => {
    const user1 = makeUser();
    const user2 = makeUser();
    expect(getMutualFriends(user1, user2)).toEqual([]);
});

test('getMutualFriends 2', () => {
    // Users's creation
    const users = [
        makeUser({ id: 2 }),
        makeUser({ id: 8 }),
        makeUser({ id: 7 }),
        makeUser({ id: 100 }),
    ];

    const user1 = makeUser({ friends: [users[0], users[1], users[3]] });
    const user2 = makeUser({ friends: [users[0], users[3], users[2]] });
    const mutualFriends = getMutualFriends(user1, user2).sort();
    expect(mutualFriends).toEqual([users[0], users[3]].sort());
});
