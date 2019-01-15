import { polyfill } from './util/console.ident';
import _ from 'lodash';
import is from '@sindresorhus/is';

polyfill();

// const prependIsA = newStr => 'isA' + _.capitalize(newStr);

// Testing that something of a type exists can be handled by `expect.any( constructor )`
// `expect.isAArray()` would be the same as `expect.any(Array)`
// There may come come a time when the isA syntax is easier, but for now `any` will do quite well.

// expect.extend( _.reduce( is, ( acc, v, k ) => ( {
//     ...acc,
//     [  prependIsA( k ) ]: testValue => v( testValue ) ? () => ( { message: `${testValue} is a ${k}`, pass: true } ) : () => ( { message: `${testValue} is not a ${k}`, pass: true } )
// } ), {}) );
