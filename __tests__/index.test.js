import path from 'path';
import fs from 'fs';
import diff from '../src/';

const getFixturePath = filepath => path.join(__dirname, '__fixtures__', filepath);

let result;

beforeAll(() => {
  result = fs.readFileSync(getFixturePath('result.txt'), 'utf-8');
});

test('JSON', () => {
  const before = getFixturePath('before.json');
  const after = getFixturePath('after.json');
  expect(diff(before, after)).toBe(result);
});

test('YML', () => {
  const before = getFixturePath('before.yml');
  const after = getFixturePath('after.yml');
  expect(diff(before, after)).toBe(result);
});

test('INI', () => {
  const before = getFixturePath('before.ini');
  const after = getFixturePath('after.ini');
  expect(diff(before, after)).toBe(result);
});
