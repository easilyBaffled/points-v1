## Task Node - 1/13/19

There are a number of possible task types, but all have at minimum the following:

```
{
	...standardNode,
	status: 'Done' | 'Active'
}
```

### Reward Task

A reward task is indicated in the markdown by having a “:” followed by a `reward` string. For testing purposes, the string will be split by the **last** occurrence of the “:”. Possibly use `:([^:]+)$`.
A Reward Task has the minimal shape:

```
{
    ...taskNode,
	reward: RewardObject
}
```

### Check Task

The UI for this task includes a checkbox to indicate and trigger the task’s completion. The UI is indicated by the type of the node. A check task does not necessarily need a reward as it can be part of a group

```
{
	...taskNode,
	...rewardTask?,
	type: 'listItem'
}
```

### Rule Task

The string of this node is prefixed by a rule string. That rule is converted in a validation function to determine when the task is completed. The rule is stored as a string that will be mapped to a function.

```
{
	...taskNode,
	rule: 'string'
}
```

### Collection Task

This is reserved for groups and projects as such it is indicated by it’s type, but it must also have a reward. It will often include a Rule that will indicate the success of the group.

```
	...rewardTask
	...ruleTask?,
	type: 'heading',
	depth: 1 | 3
```
