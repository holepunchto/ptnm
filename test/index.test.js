'use strict'
const test = require('brittle')
const match = require('..')

test('pattern must be a non-null object', (t) => {
  t.is(match({}, null), false)
  t.is(match({}, undefined), false)
  t.is(match({}, 0), false)
  t.is(match({}, ''), false)
  t.is(match({}, true), false)
})

test('empty pattern always matches', (t) => {
  t.is(match({}, {}), true)
  t.is(match({ a: 1 }, {}), true)
})

test('basic exact match', (t) => {
  t.is(match({ a: 1 }, { a: 1 }), true)
  t.is(match({ a: 1 }, { a: 2 }), false)
})

test('subset match: extra keys in message allowed', (t) => {
  t.is(match({ a: 1, b: 2 }, { a: 1 }), true)
  t.is(match({ a: 1, b: 2 }, { b: 2 }), true)
})

test('missing key in message fails', (t) => {
  t.is(match({}, { a: 1 }), false)
  t.is(match({ b: 2 }, { a: 1 }), false)
})

test('nested object subset match', (t) => {
  t.is(match({ a: { b: 1, c: 2 } }, { a: { b: 1 } }), true)
  t.is(match({ a: { b: 2 } }, { a: { b: 1 } }), false)
})

test('type mismatch at leaf fails', (t) => {
  t.is(match({ a: 1 }, { a: '1' }), false)
  t.is(match({ a: false }, { a: 0 }), false)
})

test('null is not treated as nested', (t) => {
  t.is(match({ a: null }, { a: null }), true)
  t.is(match({ a: null }, { a: {} }), false)
  t.is(match({ a: {} }, { a: null }), false)
})

test('arrays are treated like objects via index keys', (t) => {
  t.is(match({ a: [1, 2, 3] }, { a: [1, 2] }), true)
  t.is(match({ a: [1, 2, 3] }, { a: [2] }), false)
  t.is(match({ a: [] }, { a: [1] }), false)
})

test('NaN never matches NaN because !==', (t) => {
  t.is(match({ a: NaN }, { a: NaN }), false)
})

test('Date patterns match any object because no enumerable keys', (t) => {
  t.is(match({ a: new Date(0) }, { a: new Date(1) }), true)
  t.is(match({ a: {} }, { a: new Date(1) }), true)
  t.is(match({ a: 1 }, { a: new Date(1) }), false)
})

test('non-enumerable pattern keys are ignored', (t) => {
  const pattern = {}
  Object.defineProperty(pattern, 'a', { value: 1, enumerable: false })

  t.is(match({}, pattern), true)
  t.is(match({ a: 999 }, pattern), true)
})

test('inherited pattern keys are ignored', (t) => {
  const pattern = Object.create({ a: 1 })
  t.is(match({}, pattern), true)

  pattern.a = 1
  t.is(match({}, pattern), false)
  t.is(match({ a: 1 }, pattern), true)
})

test('circular structures blow up', (t) => {
  const msg = {}
  msg.self = msg
  const pattern = {}
  pattern.self = pattern
  try {
    match(msg, pattern)
    t.fail('should throw')
  } catch (err) {
    t.ok(err instanceof RangeError) // t.exception rethrows natives
  }
})
