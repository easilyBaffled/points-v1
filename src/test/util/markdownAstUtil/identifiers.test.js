import markdownReader from '../../../util/markdownReader';
import { identifiers, is, identifyNode } from '../../../util/markdownAstUtil/identifiers';

const stripTabs = ([s]) => s.replace(/(\t|    )/g, '');

const makeTestNode = markdownString =>
    markdownReader(markdownString).children[0];

describe('is', () => {
    test('throws an error if target is empty', () => {
        const expected = TypeError(`is expects the second value is empty`);
        const actual = () => is('projectStart', []);
        expect(actual).toThrow(expected);
    });

    test('throws an error if type is not in identifiers', () => {
        const expected = TypeError;
        const actual = () => is({}, { type: 'heading', depth: 1 });
        expect(actual).toThrow(expected);
    });
});

const md = {
    projectHeading: '# test',
    break: '---',
    groupHeading: '### test',
    listItem: '- test'
};

describe('identifiers', () => {
    test('projectStart', () => {
        const astNode = makeTestNode(md.projectHeading);
        const actual = is('projectStart', astNode);
        const expected = true;
        expect(actual).toEqual(expected);
    });

    test("projectStart won't match groupHeader", () => {
        const astNode = makeTestNode(md.groupHeading);
        const actual = is('projectStart', astNode);
        const expected = false;
        expect(actual).toEqual(expected);
    });

    describe('projectTerminal', () => {
        test('break', () => {
            const astNode = makeTestNode(md.break);
            const actual = is('projectTerminal', astNode);
            const expected = true;
            expect(actual).toEqual(expected);
        });

        test('project', () => {
            const astNode = makeTestNode(md.projectHeading);
            const actual = is('projectTerminal', astNode);
            const expected = true;
            expect(actual).toEqual(expected);
        });

        test('no match', () => {
            const astNode = makeTestNode(md.listItem);
            const actual = is('projectTerminal', astNode);
            const expected = false;
            expect(actual).toEqual(expected);
        });
    });

    test('groupStart', () => {
        const astNode = makeTestNode(md.groupHeading);
        const actual = is('groupStart', astNode);
        const expected = true;
        expect(actual).toEqual(expected);
    });

    describe('groupTerminal', () => {
        test('break', () => {
            const astNode = makeTestNode(md.break);
            const actual = is('groupTerminal', astNode);
            const expected = true;
            expect(actual).toEqual(expected);
        });

        test('project', () => {
            const astNode = makeTestNode(md.projectHeading);
            const actual = is('groupTerminal', astNode);
            const expected = true;
            expect(actual).toEqual(expected);
        });

        test('groupHeading', () => {
            const astNode = makeTestNode(md.groupHeading);
            const actual = is('groupTerminal', astNode);
            const expected = true;
            expect(actual).toEqual(expected);
        });

        test('new indent - listItem', () => {
            const astNode = makeTestNode(md.listItem);
            const actual = is('groupTerminal', astNode);
            const expected = true;
            expect(actual).toEqual(expected);
        });

        test('new indent - extra proof', () => {
            const astNode = markdownReader(stripTabs`
                ### [ ∀ ] All or Nothing Group Task: Group Reward

                  - [ ] A
                  - [ ] B


                - [ ] B
            `).children[2];

            const actual = is('groupTerminal', astNode);
            const expected = true;
            expect(actual).toEqual(expected);
        });

        test("won't match indented", () => {
            const astNode = markdownReader(stripTabs`
                ### [ ∀ ] All or Nothing Group Task: Group Reward

                  - [ ] A
                  - [ ] B


                - [ ] B
            `).children[1];

            const actual = is('groupTerminal', astNode);
            const expected = false;
            expect(actual).toEqual(expected);
        });
    });
});

