import path from 'path';
import fs from 'fs';
import diff from '../src/';

test('should work', () => {
  const folder = path.join(__dirname, '__fixtures__');

  const before = path.join(folder, 'before.json');
  const after = path.join(folder, 'after.json');
  const result = path.join(folder, 'result.txt');

  const res = fs.readFileSync(result, 'utf-8');
  expect(diff(before, after)).toBe(res);
});
