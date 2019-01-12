import {
  allFalseReducers,
  currentProjectOnlyReducers,
  currentGroupOnlyReducers,
  bothReducers
} from "../../markdownASTParser/parsingSituationReducers";
import { compileNotes } from "../../markdownASTParser/parseMdAst";

import markdownReader from "../../markdownReader";
import { removeTabs } from "../../util";

import { flattenByProp, findById } from '../testUtils';

test("Project with Groups", () => {
  const markdownString = removeTabs`
        # Project id:1
        
        - [ ] task id:2
        
        ### Group id:3
        
          - [ ] task id:4
          - [ ] task id:5
          
        ### Group id:6
        
          text id:7
        
        ---
    `;

  const markdownAst = markdownReader(markdownString).children;

  const parsingFunctions = [
    allFalseReducers.projectStart,
    currentProjectOnlyReducers._,
    currentProjectOnlyReducers.groupStart,
    bothReducers._,
    bothReducers.groupStart,
    bothReducers._,
    bothReducers.projectTerminal
  ];

  const actual = markdownAst.reduce(
    (parsed, node, i) => {
      const currentFunction = parsingFunctions[i];
      return currentFunction({ ...parsed, node });
    },
    { list: [] }
  );

  const expected = {
    list: [
      {
        type: "heading",
        depth: 1,
          childNodes: [
              { type: "list" },
              {
                type: "heading",
                depth: 3,
                childNodes: [{ type: "list" }]
              },
              {
                type: "heading",
                depth: 3,
                childNodes: [{ type: "paragraph" }]
              }
        ]
      }
    ]
  };

  expect(actual).toMatchObject(expected);
});

test("Just Groups", () => {
  const markdownString = removeTabs`       
        ### Group id:6        
          - [ ] task id:4
          - [ ] task id:5
          
        ### Group id:6       
          - [ ] task id:4
          - [ ] task id:5
    `;

  const markdownAst = markdownReader(markdownString).children;

  const parsingFunctions = [
    allFalseReducers.groupStart,
    currentGroupOnlyReducers._,
    currentGroupOnlyReducers.groupStart,
    currentGroupOnlyReducers._
  ];

  const actual = markdownAst.reduce(
    (parsed, node, i) => {
        console.log(node)
      const currentFunction = parsingFunctions[i];
      return currentFunction({ ...parsed, node });
    },
    { list: [] }
  );

  const expected = {
    list: [
      {
        type: "heading",
        depth: 3,
        childNodes: [{ type: "list" }]
      }
    ],
    currentGroup: {
      type: "heading",
      depth: 3,
        childNodes: [{ type: "list" }]
    }
  };

  expect(actual).toMatchObject(expected);
});

test("Lists and Groups and lists", () => {
  const markdownString = removeTabs`       
        - [ ] task id:4
        - [ ] task id:5
        
        ### Group id:3       
          - [ ] task id:4
          - [ ] task id:5  
        ###
        
        - [ ] task id:4
        - [ ] task id:5
        
        ### Group id:6

          - [ ] task id:4
          - [ ] task id:5
                    
        ###
        - [ ] task id:4
        - [ ] task id:5
    `;
  const markdownAst = markdownReader(markdownString).children;

  const parsingFunctions = [
    allFalseReducers._,
    allFalseReducers.groupStart,
    currentGroupOnlyReducers._,
    currentGroupOnlyReducers.groupTerminal,
    allFalseReducers._,
    allFalseReducers.groupStart,
    currentGroupOnlyReducers._,
    currentGroupOnlyReducers.groupTerminal,
    allFalseReducers._
  ];

  const actual = markdownAst.reduce(
    (parsed, node, i) => {
      const currentFunction = parsingFunctions[i];
      return currentFunction({ ...parsed, node });
    },
    { list: [] }
  );

  const expected = {
    list: [
      { type: "list" },
      {
        type: "heading",
        depth: 3,
        childNodes: [{ type: "list" }]
      },
      { type: "list" },
      {
        type: "heading",
        depth: 3,
        childNodes: [{ type: "list" }]
      },
      { type: "list" }
    ]
  };

  expect(actual).toMatchObject(expected);
});

describe("compileNotes", () => {
  test("Project with Groups", () => {
    const markdownString = removeTabs`
        # Project id:1
        
        - [ ] task id:2
        
        ### Group id:3
        
          - [ ] task id:4
          - [ ] task id:5
          
        ### Group id:6
        
            text id:7
        
        ---
    `;

    const markdownAst = markdownReader(markdownString).children;
    const actual = compileNotes(markdownAst);

    const expected = [
      {
        type: "heading",
        depth: 1,
        children: [
          { type: "list" },
          {
            type: "heading",
            depth: 3,
            children: [{ type: "list" }]
          },
          {
            type: "heading",
            depth: 3,
            children: [{ type: "paragraph" }]
          }
        ]
      }
    ];

    expect(actual).toMatchObject(expected);
  });

  test("Just Groups", () => {
    const markdownString = removeTabs`       
        ### Group id:3
        
          - [ ] task id:4
          - [ ] task id:5
        
        ### Group id:6
        
          - [ ] task id:4
          - [ ] task id:5
    `;

    const markdownAst = markdownReader(markdownString).children;
    const actual = compileNotes(markdownAst);

    const expected = [
        {
          type: "heading",
          depth: 3,
          children: [{ type: "list" }]
        },
        {
          type: "heading",
          depth: 3,
          children: [{ type: "list" }]
        }
      ];

    expect(actual).toMatchObject(expected);
  });

  test("Lists and Groups and lists", () => {
    const markdownString = removeTabs`       
        - [ ] task id:4
        - [ ] task id:5
        
        ### Group id:3       
          - [ ] task id:4
          - [ ] task id:5
          
        ###
        - [ ] task id:4
        - [ ] task id:5
        
        ### Group id:6
        
          - [ ] task id:4
          - [ ] task id:5
                    
        ###
        - [ ] task id:4
        - [ ] task id:5
    `;
    const markdownAst = markdownReader(markdownString).children;
    const actual = compileNotes(markdownAst);

    const expected = [
      { type: "list" },
      {
        type: "heading",
        depth: 3,
        children: [{ type: "list" }]
      },
      { type: "list" },
      {
        type: "heading",
        depth: 3,
        children: [{ type: "list" }]
      },
      { type: "list" }
    ];

    expect(actual).toMatchObject(expected);
  });
});

const standardNode = { //  Does not account for lists which have null for text
  type: expect.any(String),
  text: expect.any(String)
};

const parentNode = {
  ...standardNode,
  children: expect.any(Array)
};

const projectNode = {
    ...parentNode,
    depth: 1
};

const groupNode = {
    ...parentNode,
    depth: 3
};

const childNode = {
  ...standardNode,
  parent: expect.objectContaining( parentNode )
};

const taskNode = {
    ...standardNode,
    completed: expect.any(Boolean),
    rule: expect.any(String)
};

let markdownAst;
let flattenedNodes;
describe( 'v2 node organization', function() {
    beforeAll( () => {      // removeTabs isn't working
        const markdownString = removeTabs`
            # Project #1
            
                - [ ] task #2
            
                ### Group #3
                  - [ ] task #4
                ###
                
                Stand alone Text #5  
            ---
        `;

        markdownAst = compileNotes( markdownReader(markdownString).children )[ 0 ];

        flattenedNodes = flattenByProp( markdownAst, 'children' );
    } );

    describe( 'Parent Node', () => {
      test('Project Start', () => {
          const actual = findById( flattenedNodes, '1' );
          const expected = projectNode;

          expect(actual).toMatchObject( expected );
      });

      test('Group Start', () => {
          const actual = findById( flattenedNodes, '3' );
          const expected = groupNode;

          expect(actual).toMatchObject( expected );
      });
    } );

    describe('Child Node', () => {
        test( 'Stand Alone Child', () => {
            const actual = findById( flattenedNodes, '2' );
            const expected = childNode;

            expect(actual).toMatchObject( expected );
        } );

        test( 'Group as Child of Project', () => {
            const actual = findById( flattenedNodes, '3' );
            const expected = childNode;

            expect(actual).toMatchObject( expected );
        } );

        test( 'Child of Group', () => {
            const actual = findById( flattenedNodes, '4' );
            const expected = childNode;

            expect(actual).toMatchObject( expected );
        } );
    } );

    test('Text Node', () => {
        const actual = findById( flattenedNodes, '5' );
        const expected = standardNode;

        expect(actual).toMatchObject( expected );
    } );

    describe( 'Task', () => {
        test( 'Project Task', () => {
            const actual = findById( flattenedNodes, '1' );
            const expected = taskNode;

            expect(actual).toMatchObject( expected );
        } );

        test( 'Checkbox Task', () => {
            const actual = findById( flattenedNodes, '4' );
            const expected = taskNode;

            expect(actual).toMatchObject( expected );
        } )
    } )
} );
