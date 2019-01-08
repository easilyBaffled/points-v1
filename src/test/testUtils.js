import _ from 'lodash';

export function flattenByProp(obj, prop) {
    return prop in obj
        ? [].concat(obj).concat(obj[prop].map(co => flattenByProp(co, prop)).flat())
        : [ obj ]
}


export const findById  = ( nodeList, id ) => {
    _.find( nodeList, n => n.text.endsWith(`id:${id}`) )
};
