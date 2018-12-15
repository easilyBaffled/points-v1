import match from 'match-by';
import _ from 'lodash';

import { required as R } from '../index';

const SITUATION_MATCHERS = {
    allFalse: 0,
    currentProjectOnly: 1,
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
    _: ( {  list = R( ' list' ), currentProject = R( 'currentProject' ), currentGroup  = R( 'currentGroup ' ) } = R( 'properties' ) ) => ({ list, currentProject, currentGroup } )
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
        currentGroup: updateParentWithNode(currentGroup, node)
    })
};

export const updateParentWithNode = (parent = { childNodes: [] }, childNode) => ({
    ...parent,
    childNodes: [ ...( parent.childNodes ) || [], childNode ]
});

export const matchers = {
    allFalse: match( allFalseReducers ),
    currentProjectOnly: match( currentProjectOnlyReducers ),
    both: match( bothReducers )
}
