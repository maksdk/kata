//@ts-check

//@ts-ignore
export default ({ id, friends = [] } = {}) => {
    return {
        friends,
        id,
        getFriends() {
            return this.friends;
        }
    };
}