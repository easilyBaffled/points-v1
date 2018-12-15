import { updateParentWithNode, allFalseReducers, currentProjectOnlyReducers, bothReducers } from '../../../util/markdownAstUtil/parsingSituationReducers'

const nodeList = [];
const projectNode = { type: 'header', depth: 1, id: 0 };
const newProjectNode = { type: 'header', depth: 1, id: 1 };
const groupNode = { type: 'header', depth: 3, id: 2 };
const newGroupNode = { type: 'header', depth: 3, id: 3 };
const anythingElse = { type: '', id: 4 }

describe( 'allFalseReducers', () => {
    test('projectStart', () => {
        const actual = allFalseReducers.projectStart( {
            list: nodeList,
            node: projectNode
        } );

        const expected = {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
    test('groupStart', () => {
        const actual = allFalseReducers.groupStart( {
            list: nodeList,
            node: groupNode
        } );

        const expected = {
            list: nodeList,
            currentProject: false,
            currentGroup: groupNode
        };

        expect(actual).toEqual(expected);
    });
    test('default', () => {
        const actual = allFalseReducers._( {
            list: nodeList,
            currentProject: false,
            currentGroup: false,
        } );

        const expected = {
            list: nodeList,
            currentProject: false,
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
} );

describe( 'currentProjectOnlyReducers', () => {
    test('projectStart', () => {
        const actual = currentProjectOnlyReducers.projectStart( {
            list: nodeList,
            currentProject: projectNode,
            node: newProjectNode
        } );

        const expected = {
            list: [ ...nodeList, projectNode ],
            currentProject: newProjectNode,
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
    test('projectTerminal - with open group', () => {
        const actual = currentProjectOnlyReducers.projectTerminal( {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: groupNode,
        } );

        const expected = {
            list: [ ...nodeList, { ...projectNode, childNodes: [ groupNode ] } ],
            currentProject: false,
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
    test('projectTerminal no group', () => {
        const actual = currentProjectOnlyReducers.projectTerminal( {
            list: nodeList,
            currentProject: projectNode,
        } );

        const expected = {
            list: [ ...nodeList, projectNode ],
            currentProject: false,
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
    test('groupStart', () => {
        const actual = currentProjectOnlyReducers.groupStart( {
            list: nodeList,
            currentProject: projectNode,
            node: newGroupNode
        } );

        const expected = {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: newGroupNode
        };

        expect(actual).toEqual(expected);
    });
    test('default', () => {
        const actual = currentProjectOnlyReducers._( {
            list: nodeList,
            currentProject: projectNode,
            node: anythingElse,
            currentGroup: false,

        } );

        const expected = {
            list: nodeList,
            currentProject: { ...projectNode, childNodes: [ anythingElse ] },
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
} );

describe( 'bothReducers', () => {
    test('projectStart', () => {
        const actual = bothReducers.projectStart( {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: groupNode,
            node: newProjectNode,
        } );

        const expected = {
            list: [ ...nodeList, { ...projectNode, childNodes: [ groupNode ] } ],
            currentProject: newProjectNode,
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
    test('projectTerminal', () => {
        const actual = bothReducers.projectTerminal( {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: groupNode,
        } );

        const expected = {
            list: [ ...nodeList, { ...projectNode, childNodes: [ groupNode ] } ],
            currentProject: false,
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
    test('groupStart', () => {
        const actual = bothReducers.groupStart( {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: groupNode,
            node: newGroupNode,
        } );

        const expected = {
            list: nodeList,
            currentProject: { ...projectNode, childNodes: [ groupNode ] },
            currentGroup: newGroupNode
        };

        expect(actual).toEqual(expected);
    });
    test('groupTerminal', () => {
        const actual = bothReducers.groupTerminal( {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: groupNode,
        } );

        const expected = {
            list: nodeList,
            currentProject: { ...projectNode, childNodes: [ groupNode ] },
            currentGroup: false
        };

        expect(actual).toEqual(expected);
    });
    test('default', () => {
        const actual = bothReducers._( {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: groupNode,
            node: anythingElse,
        } );

        const expected = {
            list: nodeList,
            currentProject: projectNode,
            currentGroup: { ...groupNode, childNodes: [ anythingElse ] }
        };

        expect(actual).toEqual(expected);
    });
} );

describe( 'updateParentWithNode', () => {
    test( 'empty', () => {
        const actual = updateParentWithNode();

        const expected = { childNodes: [ undefined ] };

        expect(actual).toEqual(expected);
    } ),
    test( 'new parent', () => {
        const actual = updateParentWithNode( { id: 1 }, { id: 2 }  );
        const expected = {
            id: 1,
            childNodes: [ { id: 2 } ]
        }
        expect(actual).toEqual(expected);
    } ),
    test( 'expecting parent', () => {
        const actual = updateParentWithNode( {
                id: 1,
                childNodes: [ { id: 2 } ]
            }, { id: 3 }
        );
        const expected = {
            id: 1,
            childNodes: [ { id: 2 }, { id: 3 } ]
        }
        expect(actual).toEqual(expected);
    } )
} )
