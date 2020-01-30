//@ts-check

const getMutualFriends = (user1, user2) => {
    const friends1 = user1.getFriends();
    const friends2 = user2.getFriends();

    return friends1.filter(friend1 => {
        return friends2.find(friend2 => friend2.id === friend1.id);
    });
};

export default getMutualFriends;