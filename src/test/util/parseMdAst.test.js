import { allFalseReducers, currentProjectOnlyReducers, bothReducers } from '../../util/markdownAstUtil/parsingSituationReducers'
import markdownReader from '../../util/markdownReader';

const markdownString = `
# Project id:1

- [ ] task id:2

### Group id:3

  - [ ] task id:4
  - [ ] task id:5
  
### Group id:6

  text id:7

---
`;

const markdownAst = markdownReader( markdownString ).children;

const parsingFunctions = [
    allFalseReducers.projectStart,
    currentProjectOnlyReducers._,
    currentProjectOnlyReducers.groupStart,
    bothReducers._,
    bothReducers._,
    bothReducers.groupStart,
    bothReducers._,
    bothReducers.projectTerminal,
];

test( 'force parse', () => {
    markdownAst.reduce( ( parsed, node, i ) => {
        const currentFunction = parsingFunctions[ i ];
        console.log( Object.keys( parsingFunctions )[ i ], { parsed, node } );
        return currentFunction( { ...parsed, node } );
    }, { list: [] } );
} );
/*
* Given
* [
*   projectStart
*   task
*   groupstart
*   task
*   task
*   groupstart
*   text
*   projecterminal
* ]
*
* it should go as
* allFalseReducers.projectStart
* currentProjectOnlyReducers._
* currentProjectOnlyReducers.groupStart
* bothReducers._
* bothReducers._
* bothReducers.groupStart
* bothReducers._
* bothReducers.projectTerminal
*
* which should output
*
* {
*   ProjectHeader,
*   childNodes: [
*       task,
*       {
*           GroupHeader,
*           childNodes: [
*               task,
*               task,
*           ]
*       },
*       {
*           GroupHeader,
*           childNodes: [
*               text,
*           ]
*       }
*   ]
*
* }
* */
