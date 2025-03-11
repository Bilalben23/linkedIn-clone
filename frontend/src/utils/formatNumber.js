import numeral from "numeral";

export const formatNumber = (number, format = "0,0") => {
    if (number === null || number === undefined) return "N/A";
    return numeral(number).format(format);
};
