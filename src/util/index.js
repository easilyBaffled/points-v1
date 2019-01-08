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
    str.replace( /(\t|    )/g, '' );

export const flattenObjectBy = ( object, propName ) => {
    var levels = [];
    var stack = [obj];

    while (stack.length) {
        var target = stack.pop();

        levels.push(target);

        for (var key in target) {
            var val = target[key];
            if (R.type(val) == 'Object') {
                stack.push(val);
            }
        }
    }

    return levels;
};
