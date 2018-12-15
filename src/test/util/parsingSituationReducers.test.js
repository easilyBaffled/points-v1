import { allFalseReducers, currentProjectOnlyReducers, bothReducers } from '../../util/markdownAstUtil/parsingSituationReducers'

const nodeList = [];
const projectNode = { type: 'header', depth: 1 };
const groupNode = { type: 'header', depth: 3 };


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
    test('projectStart', () => {});
    test('projectTerminal', () => {});
    test('groupStart', () => {});
    test('default', () => {});
} );

describe( 'bothReducers', () => {
    test('projectStart', () => {});
    test('projectTerminal', () => {});
    test('groupStart', () => {});
    test('groupTerminal', () => {});
    test('default', () => {});
} );
