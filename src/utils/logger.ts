import chalk from 'chalk';

const P = '  ';

export const log = {
  info:    (msg: string) => console.log(P + chalk.cyan('ℹ') + ' ' + msg),
  success: (msg: string) => console.log(P + chalk.green('✓') + ' ' + chalk.green(msg)),
  warn:    (msg: string) => console.log(P + chalk.yellow('⚠') + ' ' + chalk.yellow(msg)),
  error:   (msg: string) => console.error(P + chalk.red('✗') + ' ' + chalk.red(msg)),
  blank:   ()            => console.log(),

  section: (msg: string) => {
    console.log();
    console.log(P + chalk.bold(msg));
  },

  file: (action: 'create' | 'skip' | 'overwrite', filePath: string) => {
    const icon  = { create: chalk.green('+'), skip: chalk.yellow('–'), overwrite: chalk.blue('↺') }[action];
    const color = { create: chalk.green,      skip: chalk.yellow,      overwrite: chalk.blue     }[action];
    console.log(P + '  ' + icon + ' ' + color(filePath));
  },

  dryFile: (filePath: string) => {
    console.log(P + '  ' + chalk.dim('[dry]') + ' ' + chalk.dim(filePath));
  },
};
