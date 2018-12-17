import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import match from 'match-by';
import _ from 'lodash';

import './styles.css';
import { polyfill } from './util/console.ident';
import markdownReader, { lint, tabsToSpaces } from './markdownReader';
import { compileNotes } from './markdownASTParser/parseMdAst';
import test from './test.md';

polyfill();

const mdAst = markdownReader(test);
const notesObject = compileNotes(mdAst.children);
console.log({ mdAst, notesObject });

const hasChildNodes = node => !_.isEmpty(node.childNodes);
const hasChildren = node => !_.isEmpty(node.children);

const ProjectHeader = ({ children: node }) => (
    <h1>
        <Text>{node}</Text>
    </h1>
);
const GroupHeader = ({ children: node }) => (
    <h3>
        <Text>{node}</Text>
    </h3>
);
const ChildNodes = ({ children }) => (
    <div style={{ paddingLeft: 25 }}>{children}</div>
);
const Task = ({ checked, children }) => (
    <li>
        <input type="checkbox" checked={checked} />
        <Text>{children}</Text>
    </li>
);
const Text = ({ children: node }) => gatherChildren(node);

const identifiers = {
    projectStart: { type: 'heading', depth: 1 }, // node.children[0].value
    groupStart: { type: 'heading', depth: 3 }, // node.children[0].value
    taskList: { type: 'list' }, // node.children.map( child => child.type === 'listItem' ? { value: child.value, checked: child.checked } : ... )
    paragraph: { type: 'paragraph' } // node.children.map( child => child.type === 'text' ? child.value : '\n' ).join( ' ' )
};

const identifiersTestExpression = node =>
    _.reduce(
        identifiers,
        (acc, matcher, type) => ({
            ...acc,
            [type]: _.isMatch(node, identifiers[type])
        }),
        {}
    );

const gatherChildren = node =>
    node.value
        ? node.value
        : hasChildren(node)
        ? _.map(node.children, gatherChildren).join(' ')
        : '';

const matchToComponent = node =>
    match(
        {
            projectStart: () => <ProjectHeader>{node}</ProjectHeader>,
            groupStart: () => <GroupHeader>{node}</GroupHeader>,
            taskList: () => (
                <ul>
                    {node.children.map(child =>
                        child.children.length === 1 ? (
                            <Task checked={child.checked}>{child}</Task>
                        ) : (
                            [
                                <Task checked={child.checked}>
                                    {child.children[0]}
                                </Task>,
                                <ChildNodes>
                                    {child.children[1].children.map(
                                        subChild => (
                                            <Task checked={subChild.checked}>
                                                {subChild}
                                            </Task>
                                        )
                                    )}
                                </ChildNodes>
                            ]
                        )
                    )}
                </ul>
            ),
            paragraph: () => (
                <p>
                    <Text>{node}</Text>
                </p>
            ),
            _: () => <div>WIP: {JSON.stringify(node)}</div>
        },
        identifiersTestExpression(node)
    );

const mdReducer = nodeList => {
    // console.log(nodeList);
    return nodeList.reduce((acc, node) => {
        //console.log(node.type, node);
        return [
            ...acc,
            matchToComponent(node),
            ...(hasChildNodes(node)
                ? [<ChildNodes>{mdReducer(node.childNodes)}</ChildNodes>]
                : [])
        ];
    }, []);
};

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
            <div className="custom-render">{mdReducer(notesObject)}</div>
        </div>
    );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
