import { removeTabs } from '../../util';

import {
    taskNode,
    rewardTask,
    checkTask,
    ruleTask,
    flattenByProp,
    findById
} from '../testUtils';
import { compileNotes } from '../../markdownASTParser/parseMdAst';
import markdownReader from '../../markdownReader';

let markdownAst;
let flattenedNodes;
describe('v2 task organization', () => {
    beforeAll(() => {
        // removeTabs isn't working
        const markdownString = removeTabs`                        
            - [ ] @1 check task
            
            - [ ] @2 task with a reward: 2
            
            - [ ] [∀] @3 task with a rule
            
            ### [∀] @4 collection task: 1
                - [ ] @5 task with a reward: 2 
        `;

        markdownAst = compileNotes(markdownReader(markdownString).children)[0];

        flattenedNodes = flattenByProp(markdownAst, 'children');
    });
    describe('Standard Task Node', () => {
        test('has a status value', () => {
            const expected = findById(flattenedNodes, '1');
            const actual = taskNode;

            expect(actual).toMatchObject(expected);
        });
    });

    describe('Reward Task Node', () => {
        describe('Stand Alone', () => {
            test('has a reward object ', () => {
                const expected = findById(flattenedNodes, '2');
                const actual = rewardTask;

                expect(actual).toMatchObject(expected);
            });
        });
        describe('Collection Header', () => {
            test('has a reward object ', () => {
                const expected = findById(flattenedNodes, '4');
                const actual = rewardTask;

                expect(actual).toMatchObject(expected);
            });
        });
    });

    describe('Check Task Node', () => {
        describe('Stand Alone', () => {
            test('is a listItem', () => {
                const expected = findById(flattenedNodes, '1');
                const actual = checkTask;

                expect(actual).toMatchObject(expected);
            });
        });
        describe('Child Node', () => {
            test('is a listItem', () => {
                const expected = findById(flattenedNodes, '5');
                const actual = checkTask;

                expect(actual).toMatchObject(expected);
            });
        });
        describe('Collection Header', () => {
            test('cannot be a check task ', () => {
                const expected = findById(flattenedNodes, '4');
                const actual = checkTask;

                expect(actual).not.toMatchObject(expected);
            });
        });
    });

    describe('Rule Task Node', () => {
        describe('Stand Alone', () => {
            test('has a rule object ', () => {
                const expected = findById(flattenedNodes, '3');
                const actual = ruleTask;

                expect(actual).toMatchObject(expected);
            });
        });
        describe('Collection Header', () => {
            test('has a rule object ', () => {
                const expected = findById(flattenedNodes, '4');
                const actual = ruleTask;

                expect(actual).toMatchObject(expected);
            });
        });
    });
});
