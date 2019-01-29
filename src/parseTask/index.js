import _ from 'lodash';

/**
 * @typedef {object} RuleObject
 * @property {string} name
 * @property {array|object} params
 */

/**
 * @typedef {object} RewardObject
 * @property {string|number} value
 */

/**
 * @typedef {object} ParsedText
 * @property {string} text
 * @property {RuleObject} rule
 * @property {RewardObject} reward
 */

const rulesMapper = {
    '∀': 'allOrNothing',
    '👉': 'poke'
};

const iconSet = Object.keys(rulesMapper).join('|');

const rulesMatcher = new RegExp(`^\\[?(${iconSet})\\]?\s*(.*)`);

/**
 * @param {string} text
 * @returns {ParsedText}
 */
export const parseTaskText = text =>
    parsingFuncs.reduce(
        (acc, { name, regexp, func }) =>
            acc.text.match(regexp)
                ? { ...acc, ...func(...acc.text.match(regexp).slice(1)) }
                : acc,
        { text }
    );

const parsingFuncs = [
    {
        name: 'rules',
        regexp: rulesMatcher,
        func: (icon, text) => ({
            text: text.trim(),
            rule: { name: rulesMapper[icon], params: {} }
        }) // Add param checking later
    },
    {
        name: 'reward',
        regexp: /(.*)\:([^:]*$)/,
        func: (text, value) => ({ text: text.trim(), reward: { value } })
    }
];
