import numeral from 'numeral';

export const formatShortNumber = (num) => {
    return numeral(num).format('0.[0]a').toUpperCase(); // Example: 1000 -> 1K, 1500000 -> 1.5M
};
