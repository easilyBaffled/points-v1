import _ from 'lodash';
import fp from 'lodash/fp';
import match from 'match-by';

/***********
 *  utils  *
 ***********/
const getType = node => node.type;

const getStartPosition = node => node.position.start.line;

const getEndPosition = node => node.position.end.line;

const objHasAll = (matching, obj) => _.matches(matching)(obj);

const toArray = v => [].concat(v);

const getIndentation = node => node.position.indent;

/********************
 *  external utils  *
 ********************/
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
 * @typedef AstNode
 * @type {!object}
 * @property {string} type;
 */

/**
 * A function that can determine if an AST node is of a given type
 *
 * @param {string} type
 * @param {AstNode} astNode
 *
 * @return boolean
 */
export const is = _.curry((type, astNode) => {
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
});
