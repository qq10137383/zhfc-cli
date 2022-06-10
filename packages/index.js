const { Command } = require('commander')
const pkg = require('../package.json')
const create = require('./cmd/create')

/**
 * 运行cli
 */
async function runCLI() {
    const cli = new Command()

    cli
        .name(pkg.name)
        .description(pkg.description)
        .version(pkg.version)

    // create
    cli.command('create')
        .argument('<dir>', '应用目录名')
        .description('创建前端应用')
        .action(create)

    cli.parse()
}

module.exports = runCLI