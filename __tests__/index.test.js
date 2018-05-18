import path from 'path';
import fs from 'fs';
import diff from '../src/';

const getFixturePath = filepath => path.join(__dirname, '__fixtures__', filepath);

let result;
let resultPlain;
let resultJson;

beforeAll(() => {
  result = fs.readFileSync(getFixturePath('result.txt'), 'utf-8');
  resultPlain = fs.readFileSync(getFixturePath('resultPlain.txt'), 'utf-8');
  resultJson = fs.readFileSync(getFixturePath('result.json'), 'utf-8');
});

test('JSON', () => {
  const before = getFixturePath('before.json');
  const after = getFixturePath('after.json');
  expect(diff(before, after)).toBe(result);
  expect(diff(before, after, 'plain')).toBe(resultPlain);
  expect(diff(before, after, 'json')).toBe(resultJson);
});

test('YML', () => {
  const before = getFixturePath('before.yml');
  const after = getFixturePath('after.yml');
  expect(diff(before, after)).toBe(result);
  expect(diff(before, after, 'plain')).toBe(resultPlain);
  expect(diff(before, after, 'json')).toBe(resultJson);
});

test('INI', () => {
  const before = getFixturePath('before.ini');
  const after = getFixturePath('after.ini');
  expect(diff(before, after)).toBe(result);
  expect(diff(before, after, 'plain')).toBe(resultPlain);
  expect(diff(before, after, 'json')).toBe(resultJson);
});
