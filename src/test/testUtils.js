import _ from 'lodash';

export function flattenByProp(obj, prop) {
    return prop in obj
        ? _.flatten(
              []
                  .concat(obj)
                  .concat(obj[prop].map(co => flattenByProp(co, prop)))
          )
        : [obj];
}

export const findById = (nodeList, id) =>
    _.find(nodeList, n =>
        new RegExp(`#${id}|@${id}`).test(typeof n === 'string' ? n : n.text)
    );

export const standardNode = {
    //  Does not account for lists which have null for text
    type: expect.any(String),
    text: expect.any(String)
};

export const parentNode = {
    ...standardNode,
    children: expect.any(Array)
};

export const projectNode = {
    ...parentNode,
    depth: 1
};

export const groupNode = {
    ...parentNode,
    depth: 3
};

export const childNode = {
    ...standardNode,
    parent: expect.objectContaining(parentNode)
};

/*
 * Task Nodes
 * */
export const taskNode = {
    ...standardNode,
    status: expect.stringMatching(/Done|Active/)
};

export const rewardTask = {
    ...taskNode,
    reward: expect.objectContaining({ value: expect.anything() })
};

export const checkTask = {
    ...taskNode,
    type: 'listItem'
};

export const ruleTask = {
    ...taskNode,
    rule: expect.stringMatching(/allOrNothing|first/)
};

export const collectionTask = {
    ...taskNode,
    ...parentNode
};
