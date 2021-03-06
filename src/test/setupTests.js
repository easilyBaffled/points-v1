import _ from 'lodash';

console.ident = (v, l = '') => (console.log(l, v), v);

expect.extend({
    toBeEmpty(actual) {
        const pass = _.isEmpty(actual);
        const message = pass
            ? () => `expected ${actual} to be empty`
            : () => `expected ${actual} to be empty`;

        return { message, pass };
    },
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () =>
                    `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true
            };
        } else {
            return {
                message: () =>
                    `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false
            };
        }
    }
});
