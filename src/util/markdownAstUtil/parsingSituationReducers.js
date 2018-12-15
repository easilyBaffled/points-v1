import match from 'match-by';
import _ from 'lodash';

const SITUATION_MATCHERS = {
    allFalse: 0,
    currentProjectOnly: 1,
    bothReducers: 3
};

export const allFalseReducers = {
    projectStart: ({list, node}) => ({
        list,
        currentProject: node,
        currentGroup: false
    }),
    groupStart: ({list, node}) => ({
        list,
        currentProject: false,
        currentGroup: node
    }),
    _: ({ list, currentProject, currentGroup }) => ({ list, currentProject, currentGroup } )
};

export const currentProjectOnlyReducers = {
    projectStart: ({ list, currentProject, node }) => ({
        list: list.concat(currentProject),
        currentProject: node,
        currentGroup: false
    }),
    projectTerminal: ({ list, currentProject, currentGroup }) => ({
        // TODO: Add situation where you have an open group
        list: list.concat(
            currentGroup
                ? updateParentWithNode(currentProject, currentGroup)
                : currentProject
        ),
        currentProject: false,
        currentGroup: false
    }),
    groupStart: ({ list, currentProject, currentGroup, node }) => ({
        // TODO: Add situation where you have an open group
        list,
        currentProject: currentGroup
            ? updateParentWithNode(currentProject, currentGroup)
            : currentProject,
        currentGroup: node
    }),
    _: ({ list, currentProject, node }) => ({
        list,
        currentProject: updateParentWithNode(currentProject, node),
        currentGroup: false
    })
};

export const bothReducers = {
    projectStart: ({ list, currentProject, currentGroup, node }) => ({
        list: list.concat(updateParentWithNode(currentProject, currentGroup)),
        currentProject: node,
        currentGroup: false
    }),
    projectTerminal: ({ list, currentProject, currentGroup }) => ({
        list: list.concat(updateParentWithNode(currentProject, currentGroup)),
        currentProject: false,
        currentGroup: false
    }),
    groupStart: ({ list, currentProject, currentGroup, node }) => ({
        list: list.concat(updateParentWithNode(currentProject, currentGroup)),
        currentProject: currentGroup
            ? updateParentWithNode(currentProject, currentGroup)
            : currentProject,
        currentGroup: node
    }),
    groupTerminal: ({ list, currentProject, currentGroup, node }) => ({
        list: list.concat(updateParentWithNode(currentProject, currentGroup)),
        currentProject: updateParentWithNode(currentProject, node),
        currentGroup: false
    }),
    _: ({ list, currentProject, currentGroup, node }) => ({
        list,
        currentProject,
        currentGroup: updateParentWithNode(currentGroup, node)
    })
};

const updateParentWithNode = (parent = { childNodes: [] }, childNode) => ({
    ...parent,
    childNodes: parent.childNodes.concat(childNode)
});

export const matchers = {
    allFalse: match( allFalseReducers ),
    currentProjectOnly: match( currentProjectOnlyReducers ),
    both: match( bothReducers )
}
