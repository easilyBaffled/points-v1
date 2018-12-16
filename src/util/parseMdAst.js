import _ from 'lodash';
import fp from 'lodash/fp';
import match from 'match-by';

import { applyIs } from './markdownAstUtil/parsingSituationReducers';
import {
    SITUATION_MATCHERS,
    preparedMatchers
} from './markdownAstUtil/parsingSituationReducers';
import { objToBitKey } from './index';

/**
 * Takes the current parsing situation ( are we within a group, within a project, within a group within a project, or top level )
 * And returns a set of functions to identify the node for that situation that can be used as the `testExpression` in a `match` function.
 */
export const bitFlagSituationMatcher = match( {
    [ SITUATION_MATCHERS.allFalse ]: () => preparedMatchers.allFalse,
    [ SITUATION_MATCHERS.currentProjectOnly ]: () => preparedMatchers.currentProjectOnly,
    [ SITUATION_MATCHERS.currentGroupOnly ]: () => preparedMatchers.currentGroupOnly,
    [ SITUATION_MATCHERS.bothReducers ]: () => preparedMatchers.both
} ) ;

export const compileNotes = nodeList =>
    nodeList.reduce(
        ({ list, ...status }, node) => {
            const bitKey = objToBitKey( status );
            console.log( `${bitKey} -> ${node.type}` );
            if ( node.type === 'paragraph' )
                console.log( node )
            const situationMatcher = bitFlagSituationMatcher( bitKey );
            const situationReducer = situationMatcher( node );

            return situationReducer( {
                list,
                ...status,
                node
            } );
        },
        { list: [], currentProject: false, currentGroup: false }
    ).list;
