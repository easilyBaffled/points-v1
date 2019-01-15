# Points

The purpose of this project (not just v1) is to be the first step towards making a new “Points” todo list app that uses a design to give tasks weights, rather than being just a checklist.

The version 0 of Points is a markdown file and a set of rules that I have kept in my head. The rules are tied to the markdown format. “#”, “###”, and “——“designate groupings, `[^:]:\w+$` indicates a task. 
The purpose of points-v1 is to create a formalized structure that emulates the rules I have created and the structure of the markdown formatting. 

This part will take in a Points-v0 markdown file representing a “Points” todo list and convert it to an AST that follows the organizing principles of my design. This includes grouping tasks and extracting points and evaluation rules from the strings. 
That AST will be used as the basis for the rest of the app going forward. The full app will have a way to add and update tasks along with a proper UI to display them.

The project uses `unified`’s `remark-parse` to parse the markdown string into the initial Markdown AST. This initial AST is a flat structure in that there sense of grouping. For example:
```
# Header
## Subheader
  - l1
  - l2
```
Header has no indication that Subheader and the list might be associated with it. Instead the parsed Header has a `children` property that holds its text.
Points-v1 will parse through the initial Markdown AST and apply my rules to create a parent-child relationship and other organizing principles.

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

# Task

## Task Specific Rules - Prefix

Tasks, or Task Sets can include rules for the task's completion. These rules are indicated by a symbol infront of the task.
Rewards for the task may only be rewared when the rule's qualifications have been met.

[ ∀ ] - All or Nothing
This task group can only be marked complete, when all of it's subtasks have been completed
matcher: `/^\[\s*∀\s*\]/`
state: `{ rule: ‘all-or-nothing’ }`
validation: is a task, has children, all children are checked
examples:

```
		//Pass
		### [ ∀ ] All or Nothing: 1
			- [x] anything
			- [x] anything: anything
			- [x] anything: 12

		# [ ∀ ] All or Nothing: 1
			- [x] anything
			- [x] anything: anything
			- [x] anything: 12

		//Fail
		### [ ∀ ] All or Nothing: 1
			- [x] anything
			- [x] anything: anything
			- [ ] anything: 12
		###

		### [ ∀ ] All or Nothing: 1
			- [ ] anything
			- [ ] anything: anything
			- [ ] anything: 12
		###

		### [ ∀ ] All or Nothing: 1
		###

		### [ ∀ ] All or Nothing // No reward
			- [x] anything
		###

		- [ ] [ ∀ ] - All or Nothing: 1
```

[ ∃! ] - First Success
state: { rule: ‘first’ }
matcher: /^\[\s*∃!\s*\]/
validation: node => node.children.some( isChecked )

[ x: number ] - Next number is 0
state:
{ rule: { name: ’count-down’, currentCount: x, previousNumber: null } }
{ rule: { name: ’count-down’, currentCount: y, previousNumber: x } }
{ rule: { name: ’count-down’, currentCount: 0, previousNumber: x } }

    validation:
    	node.rule.currentCount === 0,
    	node.rule. previousNumber !== 0

[ x: number ] y: number% - Next number is y% less than x
state:
{ rule: { name: ’percent-count-down’, currentCount: x, previousNumber: null } }
{ rule: { name: ’percent-count-down’, currentCount: y, previousNumber: x } }
{ rule: { name: ’percent-count-down’, currentCount: 0, previousNumber: x } }
validation:
node.rule.currentCount === 0,
node.rule. previousNumber !== 0

🕐( x: number ) - only allow x time

>     Not a state based rule, must be enforced personally

♺ ( x: number) - repeat x times
state:
{ rule: { name: ’repeat’, repetitionCount: x } }
{ rule: { name: ’repeat’, repetitionCount: 0 } }
validation
repetitionCount is a valid number

♺ - repeat daily
state:
{ rule: { name: ’repeat’, repetitionCount: symbol(‘daily’) } }
validation:
repetitionCount is a valid symbol
