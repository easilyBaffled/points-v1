import _ from 'lodash';
import fp from 'lodash/fp';
import match from 'match-by';

export const collectDetails = (...detailFunctions) => mdAst =>
    mdAst.children.map(node => detailFunctions.map(f => f(node)));

// export const collectPosition = collectDetails(
//     getType,
//     getStartPosition,
//     getEndPosition
// );

const findProjectHeaderIndex = fp.findIndex({ type: 'heading', depth: 1 });
const findLineBreakIndex = fp.findIndex({ type: 'thematicBreak' });

export const findProjectNodes = nodeList => {
    const startingNodeIndex = findProjectHeaderIndex(nodeList);
    const endingNodeIndex = findLineBreakIndex(nodeList);

    return nodeList.slice(startingNodeIndex, endingNodeIndex);
};

export const createProjectNode = nodeList => {
    const [projectHeader, ...projectNodes] = findProjectNodes(nodeList);
    return { ...projectHeader, projectNodes };
};

const findGroupHeaderIndex = fp.findIndex({ type: 'heading', depth: 3 });
const findGroupTerminal = (nodeList, startingIndex) =>
    nodeList
        .slice(startingIndex + 1)
        .reduce(
            (group, node) =>
                console.ident(
                    getStartPosition(node) - getEndPosition(_.last(group)),
                    `${getStartPosition(node)}-${getEndPosition(
                        node
                    )} ${getEndPosition(_.last(group))}`
                ) === 1
                    ? [...group, node]
                    : group,
            [nodeList[startingIndex]]
        );

export const createGroupNode = nodeList => {
    const groupIndex = findGroupHeaderIndex(nodeList);
    const groupTerminal = findGroupTerminal(nodeList, groupIndex);
    console.log(groupTerminal);
};

const objToBitFlags = o =>
    Object.values(o).reduce((a, v, i) => (v ? a | (1 << i) : a), 0);

const allFalseMatcher = match({
    projectStart: (list, node) => ({
        list,
        currentProject: node,
        currentGroup: false
    }),
    groupStart: (list, node) => ({
        list,
        currentProject: false,
        currentGroup: node
    }),
    _: _.identity
});

const currentProjectOnlyMatcher = match({
    projectStart: ({ list, currentProject, node }) => ({
        list: list.concat(currentProject),
        currentProject: node,
        currentGroup: false
    }),
    projectTerminal: ({ list, currentProject, node }) => ({
        // TODO: Add situation where you have an open group
        list: list.concat(currentProject),
        currentProject: false,
        currentGroup: false
    }),
    groupStart: ({ list, currentProject, currentGroup, node }) => ({
        // TODO: Add situation where you have an open group
        list,
        currentProject,
        currentGroup: node
    }),
    _: ({ list, currentProject, node }) => ({
        list,
        currentProject: updateParentWithNode(currentProject, node),
        currentGroup: false
    })
});

const bothMatcher = match({
    projectStart: ({ list, currentProject, currentGroup, node }) => ({
        list: list.concat(updateParentWithNode(currentProject, currentGroup)),
        currentProject: node,
        currentGroup: false
    }),
    projectTerminal: ({ list, currentProject, currentGroup, node }) => ({
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
});

const updateParentWithNode = (parent = { childNodes: [] }, childNode) => ({
    ...parent,
    childNodes: parent.childNodes.concat(childNode)
});

const bitGateMatch = match({
    0: allFalseMatcher(applyIs('projectStart', 'groupStart')),
    1: currentProjectOnlyMatcher(
        applyIs('projectStart', 'projectTerminal', 'groupStart')
    ),
    // 2: 'currentGroup only',
    3: bothMatcher(
        applyIs(
            'projectStart',
            'projectTerminal',
            'groupStart',
            'groupTerminal'
        )
    ),
    _: _.identity
});

export const compileNotes = nodeList => {
    nodeList.reduce(
        ({ list, ...status }, node) => {
            const bitKey = objToBitFlags(status);
            const paringFunc = bitGateMatch(bitKey);
            // return paringFunc( { list, ...status, node } )
            // If all false then if its a project, flip project, if it's a gorup flip current group

            return { list, ...status };
        },
        { list: [], currentProject: false, currentGroup: false }
    );
};

console.log(test, bitGateMatch(objToBitFlags(test)));
