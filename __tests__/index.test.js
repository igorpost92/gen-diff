import path from 'path';
import fs from 'fs';
import diff from '../src/';

const folder = path.join(__dirname, '__fixtures__');

const resultPath = path.join(folder, 'result.txt');
const result = fs.readFileSync(resultPath, 'utf-8');

test('JSON', () => {
  const before = path.join(folder, 'before.json');
  const after = path.join(folder, 'after.json');
  expect(diff(before, after)).toBe(result);
});

test('YML', () => {
  const before = path.join(folder, 'before.yml');
  const after = path.join(folder, 'after.yml');
  expect(diff(before, after)).toBe(result);
});
