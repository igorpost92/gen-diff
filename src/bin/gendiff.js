#!/usr/bin/env node
import commander from 'commander';
import { version } from '../../package.json';

commander
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((first, second) => {
    console.log(`first ${first}`);
    console.log(`second ${second}`);
  })
  .parse(process.argv);
