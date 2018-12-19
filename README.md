# Points

The purpose of this project is to be the first step towards making a new “Points” todo list app that uses a design to give tasks weights, rather than being just a checklist.

This part will take in a markdown file representing a “Points” todo list and convert it to an AST that follows the organizing principles of my design.

The project uses `unified`’s `remark-parse` to parse the markdown string into the initial Markdown AST.
This initial AST is a flat structure so parse through it and apply my rules to create a parent-child relationship and other organizing principles.

# The Rules

The resulting list can consist of:

-   `string`s,
-   Tasks,
-   Projects,
-   Groups

Projects can also contain `string`s, Tasks, and Groups
A Project is started by a line starting with a literal ‘# `string`’ and ended with a literal ‘—’, the end of the file, or the start of another Project. Everything that come between the start and end of the Project are stored in the Project’s AST Node’s `childNodes` property.
A Group is acts similar to a Project expect that it is started with a ‘### `string`’ and ended with a ‘###’-with no additional text. A Group can also be ended by the start of another Group, or anything that would end a Project.

### Grammar

```
Project {
  children {
    ProjectLabel
    ( Group | CheckTask | `string` )*
    ProjectTerminal
  }
  astNode: None.  A project is represented by a  `{ type: ‘heading’, depth: 1, childNodes: [ … ] `
}
```

```
ProjectLabel {
  value: # ( `string` | Task )
  astNode: `{ type: ‘heading’, depth: 1 }`
}
```

```
ProjectTerminal {
  value: — | ProjectLabel
  astNode: `{ type: ‘thematicBreak’ } | { type: ‘heading’, depth: 1 }`
}
```

```
Group {
  children: [
    GroupLabel
    CheckTask*
    GroupTerminal?
  ]
  astNode: None.  A project is represented by a  `{ type: ‘heading’, depth: 3, childNodes: [ … ] }`
}
```

```
GroupLabel {
  value: ### ( `string` | Task )
  astNode: `{ type: ‘heading’, depth: 3 }`
}
```

```
GroupTerminal {
  value: ### | ProjectTerminal | GroupLabel
  astNode:
    { type: ‘heading’, depth: 3, children: [ ] }
    | { type: ‘thematicBreak’ }
    | { type: ‘heading’, depth: 1 }
    |  { type: ‘heading’, depth: 3, children: [ … ] }
}
```

```
CheckTask {
  value: - [ ] ( Task | `string`)
  astNode: `{ type: ‘list’, children: [ { type: ‘listItem’ } ] }`
}
```

```
Task {
  value: `string`: Reward
  astNode: `{ …, children: [ { type: ‘text’, value: ‘…’ } ] }`
}
```

```
Reward {
  value: `string`|`number`
  astNode: `{ …, children: [ { type: ‘text’, value: ‘…’ } ] }`
}
```
