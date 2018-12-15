import _ from 'lodash';

/**
 * @typedef AstNode
 * @type {!object}
 * @property {string} type;
 * @property {number[]} position;
 */

/***********
 *  utils  *
 ***********/

/**
 *
 * @param {object} matching
 * @param {object} obj
 * @returns {*}
 */
const objHasAll = (matching, obj) => _.matches(matching)(obj);

/**
 *
 * @param {*} v
 * @returns {*[]}
 */
const toArray = v => [].concat(v);

/**
 *
 * @param {AstNode} node
 * @returns {number[]}
 */
const getIndentation = node => node.position.indent;

/********************
 *  external utils  *
 ********************/
/**
 * Converts a list of strings into a dictionary of prepared `is` functions
 * So that it can be used as a the `testExpression` in `match`
 * @param { string[] } keyStrings
 * @returns {{[string]: ( string, AstNode ) => bool }}
 */
export const applyIs = (...keyStrings) =>
    keyStrings.reduce(({ acc, str }) => ({ [str]: n => is(str, n) }), {});

/****************
 *  identifiers  *
 ****************/
export const identifiers = {
    projectStart: { type: 'heading', depth: 1 },
    projectTerminal: [{ type: 'thematicBreak' }, { type: 'heading', depth: 1 }],
    groupStart: { type: 'heading', depth: 3 },
    groupTerminal: [
        { type: 'thematicBreak' },
        { type: 'heading', depth: 3 },
        node => getIndentation(node).length === 0
    ]
};

/**
 * A function that can determine if an AST node is of a given type
 *
 * @param {string} type
 * @param {AstNode} astNode
 *
 * @return boolean
 */
export const is = (type, astNode) => {
    if (!(type in identifiers))
        throw TypeError(
            `is expects the first value to be one of [ ${Object.keys(
                identifiers
            ).join(', ')} ] but instead rescived ${JSON.stringify(type)}`
        );

    if (_.isEmpty(astNode))
        throw TypeError(`is expects the second value is empty`);

    return toArray(identifiers[type]).some(matcher =>
        _.isFunction(matcher) ? matcher(astNode) : objHasAll(matcher, astNode)
    );
}
