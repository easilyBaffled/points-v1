import match from 'match-by';

import {
    currentProjectOnlyReducers,
    currentGroupOnlyReducers,
    bothReducers,
    SITUATION_MATCHERS,
    preparedMatchers
} from './parsingSituationReducers';
import { objToBitKey } from '../util';

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
    // that may have been left without an explicet terminal
    const bitKey = objToBitKey(status);
    const finalResolution = bitKeyCleanUpMatcher(bitKey);
    return finalResolution({ list, ...status });
};
