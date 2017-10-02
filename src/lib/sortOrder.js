export default (a, b, order = 'ASC') => {
    const aLow = a.toLowerCase();
    const bLow = b.toLowerCase();

    if (aLow < bLow) {
        return (order !== 'DESC') ? -1 : 1;
    }

    if (aLow > bLow) {
        return (order !== 'DESC') ? 1 : -1;
    }

    return 0;
};
