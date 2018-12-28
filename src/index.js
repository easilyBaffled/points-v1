import React from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";

import "./styles.css";
import Points from "./experimentalPointsUI";
import { polyfill } from "./util/console.ident";
import markdownReader, { lint, tabsToSpaces } from "./markdownReader";
import { compileNotes } from "./markdownASTParser/parseMdAst";
import test from "./test.md";

polyfill();

const mdAst = markdownReader(test);
const notesObject = compileNotes(mdAst.children);
console.log({ mdAst, notesObject });
console.log(lint(test));
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
      <h1> Points Markdown ported directly to html </h1>
      <div className="container">
        <ReactMarkdown source={tabsToSpaces(test)} />
      </div>
      <h1>
        Points Markdown parsed, organized ( parent-child ) and rendered with
        custom components
      </h1>
      <div className="container">
        <div className="custom-render">
          <Points markdownAst={notesObject} />
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
