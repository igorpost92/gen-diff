#!/usr/bin/env node
import programm from 'commander';
import { version } from '../../package.json';
import diff from '..';
import { defaultFormat } from '../renderers';

programm
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', defaultFormat)
  .action((first, second) => {
    const difference = diff(first, second, programm.format);
    console.log(difference);
  })
  .parse(process.argv);

if (!programm.args.length) {
  programm.help();
}
