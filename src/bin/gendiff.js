#!/usr/bin/env node
import programm from 'commander';
import { version } from '../../package.json';
import genDiff, { defaultFormat } from '..';

process.on('uncaughtException', (err) => {
  console.error(err.message);
  process.exitCode = 1;
});

programm
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', defaultFormat)
  .action((first, second) => {
    const difference = genDiff(first, second, programm.format);
    console.log(difference);
  })
  .parse(process.argv);

if (!programm.args.length) {
  programm.help();
}
