#!/usr/bin/env node
import commander from 'commander';

commander
  .version('0.0.1')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((first, second) => {
    console.log(`first ${first}`);
    console.log(`second ${second}`);
  })
  .parse(process.argv);
