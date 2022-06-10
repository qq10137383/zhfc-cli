const chalk = require('chalk')
const format = require('util').format

/**
 * 前缀
 */
const prefix = '   zhfc-cli'
const sep = chalk.gray('·')

/**
 * 控制台显示日志信息
 * @param  {...any} args 
 */
exports.log = function (...args) {
    const msg = format.apply(format, args)
    console.log(chalk.white(prefix), sep, msg)
}

/**
 * 控制台显示错误信息并退出
 * @param  {...any} args 
 */
exports.fatal = function (...args) {
    if (args[0] instanceof Error) {
        args[0] = args[0].message.trim()
    }
    const msg = format.apply(format, args)
    console.log(chalk.red(prefix), sep, msg)
    process.exit(1)
}

/**
 * 控制台显示成功信息
 * @param  {...any} args 
 */
exports.success = function (...args) {
    const msg = format.apply(format, args)
    console.log(chalk.cyan(prefix), sep, msg)
}
