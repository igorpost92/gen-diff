#!/usr/bin/env node
import commander from 'commander';
import { version } from '../../package.json';
import diff from '..';

commander
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((first, second) => {
    const difference = diff(first, second);
    console.log(difference);
  })
  .parse(process.argv);
