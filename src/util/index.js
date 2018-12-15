/**
 * Convert an object into a bitwise number based on the boolean value of each value
 * to simplify the checks for what may be true or false
 * @param {Object} o
 * @returns {Number}
 */
export const objToBitFlags = o =>
    Object.values(o).reduce((a, v, i) => (v ? a | (1 << i) : a), 0);

/**
 * View a number as it's bits
 * @param {number} n
 * @returns {string}
 */
export const bitView = n => n.toString( 2 );
