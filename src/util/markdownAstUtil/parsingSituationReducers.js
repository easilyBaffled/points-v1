import match from 'match-by';
import _ from 'lodash';

import { required as R } from '../index';
import { applyIs } from './identifiers';

export const SITUATION_MATCHERS = {
    allFalse: 0,
    currentProjectOnly: 1,
    currentGroupOnly: 2,
    bothReducers: 3
};

export const allFalseReducers = {
    projectStart: ( { list = R( 'list' ), node = R( 'node' ) } = R( 'properties' ) ) => ({
        list,
        currentProject: node,
        currentGroup: false
    }),
    groupStart: ( { list = R( 'list' ), node = R( 'node' ) } = R( 'properties' ) ) => ({
        list,
        currentProject: false,
        currentGroup: node
    }),
    _: ( {  list = R( ' list' ), node = R( 'node' ) } = R( 'properties' ) ) => ({
        list: list.concat( node ),
        currentProject: false,
        currentGroup: false
    } )
};

export const currentProjectOnlyReducers = {
    projectStart: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        list: list.concat(currentProject),
        currentProject: node,
        currentGroup: false
    }),
    projectTerminal: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), currentGroup } = R( 'properties' ) ) => ({
        list: list.concat(
            currentGroup
                ? updateParentWithNode(currentProject, currentGroup)
                : currentProject
        ),
        currentProject: false,
        currentGroup: false
    }),
    groupStart: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        // TODO: Add situation where you have an open group
        list,
        currentProject: currentProject,
        currentGroup: node
    }),
    _: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), currentGroup = R( 'currentGroup' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        list,
        currentProject: updateParentWithNode(currentProject, node),
        currentGroup
    })
};

export const currentGroupOnlyReducers = {
    projectStart: ( {  list = R( ' list' ), currentGroup = R( 'currentGroup' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        list: list.concat(currentGroup),
        currentProject: node,
        currentGroup: false
    }),
    projectTerminal: ( {  list = R( ' list' ), currentGroup  = R( 'currentGroup ' ) } = R( 'properties' ) ) => ({
        list: list.concat(currentGroup),
        currentProject: false,
        currentGroup: false
    }),
    groupStart: ( {  list = R( ' list' ), currentGroup = R( 'currentGroup' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        list: list.concat(currentGroup),
        currentProject: false,
        currentGroup: node
    }),
    groupTerminal: ( {  list = R( ' list' ), currentGroup  = R( 'currentGroup ' ) } = R( 'properties' ) ) => ({
        list: list.concat(currentGroup),
        currentProject: false,
        currentGroup: false
    }),
    _: ( {  list = R( ' list' ), currentGroup = R( 'currentGroup' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        list,
        currentProject: false,
        currentGroup: updateParentWithNode(currentGroup, node)
    })
};

export const bothReducers = {
    projectStart: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), currentGroup = R( 'currentGroup' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        list: list.concat(updateParentWithNode(currentProject, currentGroup)),
        currentProject: node,
        currentGroup: false
    }),
    projectTerminal: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), currentGroup  = R( 'currentGroup ' ) } = R( 'properties' ) ) => ({
        list: list.concat(updateParentWithNode(currentProject, currentGroup)),
        currentProject: false,
        currentGroup: false
    }),
    groupStart: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), currentGroup = R( 'currentGroup' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        list,
        currentProject: updateParentWithNode(currentProject, currentGroup),
        currentGroup: node
    }),
    groupTerminal: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), currentGroup  = R( 'currentGroup ' ) } = R( 'properties' ) ) => ({
        list,
        currentProject: updateParentWithNode(currentProject, currentGroup),
        currentGroup: false
    }),
    _: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), currentGroup = R( 'currentGroup' ), node  = R( 'node ' ) } = R( 'properties' ) ) => ({
        list,
        currentProject,
        currentGroup: updateParentWithNode( currentGroup, node )
    })
};

/**
 * @typedef ParsingPayload
 * @type {!Object}
 * @property {(Object|Parent)[]} list;
 * @property {(Object|Parent)} currentProject;
 * @property {(Object|Parent)} currentGroup;
 * @property {Object} node;
 */

/**
 * @param {Object} childNode
 * @returns {Parent}
 */

/**
 * @typedef Parent
 * @type {!Object}
 * @property {Object[]} childNodes;
 */

/**
 *
 * @param {(Object|Parent)} parent
 * @param {Object} childNode
 * @returns {Parent}
 */
export const updateParentWithNode = (parent = { childNodes: [] }, childNode) => ({
    ...parent,
    childNodes: [ ...( parent.childNodes ) || [], childNode ]
});

console.ident = ( v, l ) => ( console.log( l, v ), v );

const constructMatcher = reducers => node => match(
    _.reduce( reducers, ( acc, v, k ) => ( {
       ...acc,
       [ k ]: () => ( console.log(k), v ) // match automatically calls a function, so this will wrap the reducer so it is not called before it can be passed the payload
    } ), {}),
    applyIs( node, Object.keys( reducers ) )
);
export const preparedMatchers = {
    allFalse: constructMatcher( allFalseReducers ),
    currentProjectOnly: constructMatcher( currentProjectOnlyReducers ),
    currentGroupOnly: constructMatcher( currentGroupOnlyReducers ),
    both: constructMatcher( bothReducers ),
};
