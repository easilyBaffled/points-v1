import unified from 'unified';
import markdown from 'remark-parse';
import report from 'vfile-reporter';
import remark from 'remark';
import styleGuide from 'remark-preset-lint-markdown-style-guide';
import headingIncrement from 'remark-lint-heading-increment';
import noLink from 'remark-lint-no-shortcut-reference-link';
import listSpacing from 'remark-lint-list-item-spacing';

export default markdownString =>
    unified()
        .use(markdown, { gfm: true })
        .parse(tabsToSpaces(markdownString));

export const lint = markdownString =>
    report(
        remark()
            .use(styleGuide)
            .use(headingIncrement, false)
            .use(noLink, false)
            .use(listSpacing, false)
            .processSync(tabsToSpaces(markdownString))
    );

export const tabsToSpaces = str => str.replace(/\t/g, '  ');
