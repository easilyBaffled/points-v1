import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';

import './styles.css';
import { polyfill } from './util/console.ident';
import markdownReader, { lint, tabsToSpaces } from './markdownReader';

import test from './test.md';

polyfill();

const mdAst = markdownReader(test);
console.log({ mdAst });

function App() {
    return (
        <div className="App">
            {null && (
                <pre>
                    <code>{test}</code>
                </pre>
            )}
            {null && (
                <pre>
                    <code>{JSON.stringify(mdAst, null, 4)}</code>
                </pre>
            )}
            <ReactMarkdown source={tabsToSpaces(test)} />
        </div>
    );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
