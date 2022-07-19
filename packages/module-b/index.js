const chalk = require('chalk')
const add = require('@pnpm-monorepo-example/module-a')

const result = add(1, 1)

console.log(chalk.yellow(`The result of 1 + 1 is ${result}`))

