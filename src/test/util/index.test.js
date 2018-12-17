import match from 'match-by';
import { objToBitKey, bitView } from '../../../util';


const emptyObject = { a: 0, b: null, c: false, d: '', e: undefined };

const createObj = o => ( { ...emptyObject, ...o } );

const bitGateMatch = match({
    0: () => "match 0",
    1: () => "match 1",
    2: () => "match 2",
});

describe( 'objToBitFlags',  ()=> {
    test(  'all false -> 0', () => {
        const actual = objToBitKey( { a: false, b: false } );
        const expected = 0;
        expect(actual).toEqual(expected);
    } );

    test(  'empty values -> 0', () => {
        const actual = objToBitKey( { a: 0, b: null, c: false, d: '', e: undefined } );
        const expected = 0;
        expect(actual).toEqual(expected);
    } );

    test(  'empty -> 0', () => {
        const actual = objToBitKey( {} );
        const expected = 0;
        expect(actual).toEqual(expected);
    } );

    test(  'only first value true -> 1', () => {
        const actual = objToBitKey( createObj( { a: true } ) );
        const expected = 1;
        expect(actual).toEqual(expected);
    } );

    test(  'position matters - 2nd value', () => {
        const actual = objToBitKey( createObj( { b: true } ) );
        const expected = 2;
        expect(actual).toEqual(expected);
    } );

    test(  'position matters - add last value', () => {
        const actual = objToBitKey( createObj( { z: true } ) );
        const expected = 32;
        expect(actual).toEqual(expected);
    } );

    test(  'every other true', () => {
        const actual = bitView( objToBitKey( createObj( { a: true, c: true, e: true } ) ) );
        const expected = "10101";
        expect(actual).toEqual(expected);
    } );

    test( 'used as the testExpression in `match`', () => {

        const bitFlags = objToBitKey( createObj( { a: true } ) );
        const actual = bitGateMatch( bitFlags );
        const expected = "match 1";
        expect(actual).toEqual(expected);
    } )
} );
