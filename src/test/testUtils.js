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
    _.find(nodeList, n => n.text && n.text.includes(`#${id}`));
