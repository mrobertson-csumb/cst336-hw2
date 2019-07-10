import test from 'ava';
import {PasswordGen, UserSelections, ALPHA_LOWER, ALPHA_UPPER, SPECIAL, NUMBERS} from '../js/common.js'

test('foo', t => {
    t.pass();
});

test('bar', async t => {
    const bar = Promise.resolve('bar');
    t.is(await bar, 'bar');
});


test('All selections', t => {
    const subject = new UserSelections(true, true, true, true, [], 1, 100);
    const gen = new PasswordGen(subject);

    // with all char types selected, all should be present in useChars
    let expect = [ALPHA_LOWER, ALPHA_UPPER, NUMBERS, SPECIAL].reduce((a, b) => [...a, ...b], []);
    let actual = gen.useChars;
    t.deepEqual(actual, expect, 'used chars');

    // generate
    const result = gen.generate();

    // check len
    t.assert(1 < result.length < 100, 'length is in range');

    // check composition
    t.assert([...result].filter(_ => !gen.useChars.includes(_)).length === 0, 'only used chars');
});

// error if no check selections or user input
// error if both lens empty or min is 0
// error if min len > max len
