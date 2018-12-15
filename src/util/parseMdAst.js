import _ from 'lodash';
import fp from 'lodash/fp';
import match from 'match-by';

export const collectDetails = (...detailFunctions) => mdAst =>
    mdAst.children.map(node => detailFunctions.map(f => f(node)));

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
