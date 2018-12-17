import unified from 'unified';
import markdown from 'remark-parse';
import report from 'vfile-reporter';
import remark from 'remark';
import styleGuide from 'remark-preset-lint-markdown-style-guide';

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
