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
    bothReducers.groupStart,
    bothReducers._,
    bothReducers.projectTerminal,
];

test( 'test full parse', () => {
    const actual = markdownAst.reduce( ( parsed, node, i ) => {
        const currentFunction = parsingFunctions[ i ];
        return currentFunction( { ...parsed, node } );
    }, { list: [] } );

    const expected = {
        list: [
            {
                type: 'heading',
                depth: 1,
                childNodes: [
                    { type: 'list' },
                    {
                        type: 'heading',
                        depth: 3,
                        childNodes: [ { type: 'list' } ]
                    },
                    {
                        type: 'heading',
                        depth: 3,
                        childNodes: [ { type: 'paragraph' } ]
                    }
                ]
            }
        ]
    };

    expect( actual ).toMatchObject( expected );
} );
