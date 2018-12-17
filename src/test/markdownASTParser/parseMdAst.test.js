import {
  allFalseReducers,
  currentProjectOnlyReducers,
  currentGroupOnlyReducers,
  bothReducers
} from "../../markdownASTParser/parsingSituationReducers";
import { compileNotes } from "../../markdownASTParser/parseMdAst";

import markdownReader from "../../markdownReader";
import { removeTabs } from "../../util";

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
        ### Group id:3
        
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

    const expected = {
      list: [
        {
          type: "heading",
          depth: 3,
          childNodes: [{ type: "list" }]
        },
        {
          type: "heading",
          depth: 3,
          childNodes: [{ type: "list" }]
        }
      ]
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
    const actual = compileNotes(markdownAst);

    const expected = [
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
    ];

    expect(actual).toMatchObject(expected);
  });
});
