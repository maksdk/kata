export default (scores) => {
    let result = 0;
    for (const score of scores) {
        result += Math.sign(score[0] - score[1]);
    }

    if (result > 0) {
        return 'canada';
    }
    if (result < 0) {
        return 'ussr';
    }

    return null;
};