import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateTotal} from '../src/pricing.mjs';
test('no discount keeps the subtotal', () => assert.equal(calculateTotal(100), 100));
test('20 percent off a 100 dollar order is 80', () => assert.equal(calculateTotal(100, 20), 80));
test('100 percent discount is free', () => assert.equal(calculateTotal(100, 100), 0));
test('negative subtotal is rejected', () => assert.throws(() => calculateTotal(-1), RangeError));
