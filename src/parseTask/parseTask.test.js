import { removeTabs } from '../util';
import { inspect } from 'util';
import {
    taskNode,
    rewardTask,
    checkTask,
    ruleTask,
    flattenByProp,
    findById
} from '../test/testUtils';
import { compileNotes } from '../markdownASTParser/parseMdAst';
import markdownReader from '../markdownReader';

const work = `
### [ ∀ ] Parse “Task”: Steven pt 1
	- [ ] Run Tests
	- [ ] confirm text is being collected properly
	- [ ] create \`parseTask\`  module
	- [ ] expectation text
Expectations
    - [ ] can parse out a reward -> reward object
    - [ ] Rule’s  “[ ]” are not miss treated as links
    - [ ] can parse out an emoji
    - [ ] can parse out the  ∀ symbol 
    - [ ] can parse out by unicode 
    - [ ] can parse any rule out from text -> rule string & map
    - [ ] If a task doesn’t have a checkbox, it has children that do
`;

let markdownAst;
let textList;
describe('Parse Task Text', () => {
    beforeAll(() => {
        const markdownString = removeTabs`
            - [ ] @1 check task
            - [ ] @2 task with a reward: 2
            - [ ] [∀] @3 task with a rule

            ### [∀] @4 collection task: 1
                - [ ] @5 task with a reward: 2
        `;

        markdownAst = compileNotes(markdownReader(markdownString).children);
        textList = flattenByProp(
            markdownAst.flatMap(ast => flattenByProp(ast, 'children')),
            'children'
        )[0]
            .map(n => console.ident(n).text)
            .filter(v => v);
    });

    test('node has a complete text attribute', () => {
        console.log(textList);
        // const expected = findById(flattenedNodes, '3');
        const actual = taskNode;

        // expect(actual).toMatchObject(expected);
    });
});
