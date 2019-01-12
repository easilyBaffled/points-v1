/**
 * Convert an object into a bitwise number based on the boolean value of each value
 * to simplify the checks for what may be true or false
 * @param {Object} o
 * @returns {Number}
 */
export const objToBitKey = o =>
    Object.values(o).reduce((a, v, i) => (v ? a | (1 << i) : a), 0);

/**
 * View a number as it's bits
 * @param {number} n
 * @returns {string}
 */
export const bitView = n => n.toString( 2 );

export const required = function ( name = 'value' ) {
    throw Error( `${name} is required for this function` );
};

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const removeTabs = ( [ str ] ) =>
    str.replace( /(\t| {4})/g, '' );
