# Points

The purpose of this project is to be the first step towards making a new “Points” todo list app that uses a design to give tasks weights, rather than being just a checklist.

This part will take in a markdown file representing a “Points” todo list and convert it to an AST that follows the organizing principles of my design.

The project uses `unified`’s `remark-parse` to parse the markdown string into the initial Markdown AST.
This initial AST is a flat structure so parse through it and apply my rules to create a parent-child relationship and other organizing principles.

# The Rules

The resulting list can consist of:

- `string`s,
- Tasks,
- Projects,
- Groups

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
	example:
		# anything
			- [ ] project task

		some text
		### sub project: 12
			text
			- [ ] anything
		---
}
```

```
ProjectLabel {
  value: # ( `string` | Task )
  astNode: `{ type: ‘heading’, depth: 1 }`
	example:
		# anything
		# anything: 12
}
```

```
ProjectTerminal {
  value: — | ProjectLabel | eof
  astNode: `{ type: ‘thematicBreak’ } | { type: ‘heading’, depth: 1 }`
	example:
		---
		# New Project
		# New Project: 12
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
	example:
		### anything
			- [ ] anything
			- [ ] anything
		### anything: 12
			text
			- [ ] anything
		###
}
```

```
GroupLabel {
  value: ### ( `string` | Task )
  astNode: `{ type: ‘heading’, depth: 3 }`
	example:
		### anything
		### anything: 12
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
	example
		###
		---
		### anything: 12
		# anything: 12
}
```

```
CheckTask {
  value: - [ ] ( Task | `string`)
  astNode: `{ type: ‘list’, children: [ { type: ‘listItem’ } ] }`
	example
		- [ ] anything
		- [ ] anything: anything
		- [ ] anything: 12
}
```

```
Task {
  value: `string`: Reward
  astNode: `{ …, children: [ { type: ‘text’, value: ‘…’ } ] }`
	example:
		anything: anything
		anything: 12
}
```

```
Reward {
  value: `string`|`number`
  astNode: `{ …, children: [ { type: ‘text’, value: ‘…’ } ] }`
	example:
		anything
		12
}
```

# Node Structure

Applying the above rules to the initial Markdown AST will create a tree structure of nodes.

## Parent-Child

### Parent

The parent-child relationships works as followed:
As the `children` attribute is already being used in the initial Markdown AST, parents in the applied AST will store their children in a `childNodes`.

> This can be updated in later iterations, when `children` is consumed by the parser
> `childNodes` are currently only applied to nodes that have children.
> `childNodes`, if it exists will be an array of nodes

### Children

Children nodes will have a reference to their parents. This will be stored in a `parent` attribute on the node. `parent` is a reference to the parent node. It will have the additional properties set `{ value: parent, enumerable: false, writable: false, configurable: false }` so that there are no circular reference issues when serializing the data.

> This does mean that the parents have to be repopulated when unserialized

## Standard Node

```
{
	type: string,
	text: string,
	rule: string,
	childNodes?: Node[]
	parent?: Node,
	checked?: boolean - List task item only
}
```
