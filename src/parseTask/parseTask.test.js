import { findById } from '../test/testUtils';

import { parseTaskText } from '.';

let textList;
let $;
describe('Parse Task Text', () => {
    beforeAll(() => {
        textList = [
            '@2 task with a reward: 2',
            '[∀] @4 collection task: 1',
            '@5 task with a reward: 2'
        ];

        $ = id => parseTaskText(findById(textList, id));
    });

    describe('Text with Reward', () => {
        test('will result in { text:string, reward: object }', () => {
            const expected = {
                text: expect.any(String),
                reward: expect.any(Object)
            };
            const actual = $(2);

            expect(actual).toEqual(expected);
        });
        test('should strip the reward text', () => {
            const expected = $(2).text;
            const actual = '@2 task with a reward';

            expect(actual).toEqual(expected);
        });
        test('result in a reward object', () => {
            const expected = $(2).reward;
            const actual = expect.objectContaining({
                value: expect.anything()
            });

            expect(actual).toEqual(expected);
        });
    });

    describe('Text with Rule', () => {
        test('will result in { text:string, rule: object }', () => {
            const expected = {
                text: expect.any(String),
                rule: expect.any(Object),
                reward: expect.any(Object)
            };
            const actual = $(4);

            expect(actual).toEqual(expected);
        });
        test('should strip the rule text', () => {
            const expected = '@4 collection task';
            const actual = $(4).text;

            expect(actual).toEqual(expected);
        });
        test('result in a reward object', () => {
            const expected = $(4).rule;
            const actual = expect.objectContaining({
                name: 'allOrNothing',
                params: expect.anything()
            });

            expect(actual).toEqual(expected);
        });
    });
});
