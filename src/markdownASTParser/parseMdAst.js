import match from 'match-by';

import {
    currentProjectOnlyReducers,
    currentGroupOnlyReducers,
    bothReducers,
    SITUATION_MATCHERS,
    preparedMatchers
} from './parsingSituationReducers';
import { objToBitKey } from '../util';
import _ from 'lodash';

/**
 * @typedef AstNode
 * @type {!object}
 * @property {string} type;
 * @property {number[]} position;
 */

/**
 * Takes the current parsing situation ( are we within a group, within a project, within a group within a project, or top level )
 * And returns a set of functions to identify the node for that situation.
 *
 * @param {number} testExpression
 * @returns {AstNode[]}
 */
export const bitKeySituationMatcher = match({
    [SITUATION_MATCHERS.allFalse]: () => preparedMatchers.allFalse,
    [SITUATION_MATCHERS.currentProjectOnly]: () =>
        preparedMatchers.currentProjectOnly,
    [SITUATION_MATCHERS.currentGroupOnly]: () =>
        preparedMatchers.currentGroupOnly,
    [SITUATION_MATCHERS.bothReducers]: () => preparedMatchers.both
});

const bitKeyCleanUpMatcher = match({
    [SITUATION_MATCHERS.allFalse]: () => ({ list }) => list,
    [SITUATION_MATCHERS.currentProjectOnly]: () =>
        currentProjectOnlyReducers.projectTerminal,
    [SITUATION_MATCHERS.currentGroupOnly]: () =>
        currentGroupOnlyReducers.groupTerminal,
    [SITUATION_MATCHERS.bothReducers]: () => bothReducers.projectTerminal
});

/**
 * Reduce the flat list of markdown AST nodes into a list of
 * nodes with a parent-child structure.
 *
 * @param {AstNode[]} matching
 * @returns {AstNode[]}
 */
export const compileNotes = nodeList => {
    const { list, ...status } = nodeList.reduce(
        ({ list, ...status }, node) => {
            // The context of the reducer will change based on the situation
            // Where you can be inside a project, inside a group, in a group in a project, or at the top level
            // Each situation will treat a node differently
            const bitKey = objToBitKey(status); // Convert the current status to an easy to check number
            const situationMatcher = bitKeySituationMatcher(bitKey); // Get the matcher coresponding to the current status
            const situationReducer = situationMatcher(node); // get the reducer function coresponding to the current node in this context

            return situationReducer({
                list,
                ...status,
                node
            });
        },
        { list: [], currentProject: false, currentGroup: false }
    );
    // Pull in final currentProject, currentGroup
    // that may have been left without an explicit terminal
    const bitKey = objToBitKey(status);
    const finalResolution = bitKeyCleanUpMatcher(bitKey);
    const finalRes = finalResolution({ list, ...status }); // TODO: looking at this I can't tell if finalResolution results in an array
    return cleanNodes(Array.isArray(finalRes) ? finalRes : finalRes.list);
};

const hasChildren = node => !_.isEmpty(node.children);

const getNodeText = node =>
    node.value
        ? node.type === 'linkReference'
            ? `[${node.value}]`
            : node.value
        : hasChildren(node)
        ? _.map(node.children.filter(n => n.type !== 'list'), getNodeText).join(
              ' '
          )
        : '';

const addParent = (node, parent) =>
    Object.defineProperty(node, 'parent', {
        value: parent,
        enumerable: process.env.NODE_ENV === 'test',
        writable: false,
        configurable: false
    });

const cleanNode = ({
    position,
    value,
    children,
    childNodes = [],
    type,
    ...node
}) => {
    const formattedNode = {
        type,
        text: type !== 'list' ? getNodeText({ value, children }) : '',
        children: (type !== 'list' ? childNodes : children).map(n =>
            cleanNode(n)
        ),
        ...node
    };
    formattedNode.children.map(c => addParent(c, formattedNode));

    return formattedNode;
};

const cleanNodes = nodes => nodes.map(cleanNode);
