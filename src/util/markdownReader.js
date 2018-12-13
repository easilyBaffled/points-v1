import unified from 'unified';
import markdown from 'remark-parse';
var report = require('vfile-reporter');
var remark = require('remark');
var styleGuide = require('remark-preset-lint-markdown-style-guide');

export default markdownString =>
    unified()
        .use(markdown, { gfm: true })
        .parse(tabsToSpaces(markdownString));

export const lint = markdownString =>
    report(
        remark()
            .use(styleGuide)
            .processSync(tabsToSpaces(markdownString))
    );

export const tabsToSpaces = str => str.replace(/\t/g, '  ');
