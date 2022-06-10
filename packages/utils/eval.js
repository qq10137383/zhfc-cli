const chalk = require("chalk")

/**
 * 在指定上下文执行表达式
 * @param {string} exp 表达式 
 * @param {Object} data 执行上下文 
 */
module.exports = function evaluate(exp, data) {
    const fn = new Function('data', `with (data) { return ${exp}}`)
    try {
        return fn(data)
    }
    catch {
        console.log(chalk.red(`执行条件过滤表达式失败！${exp}`))
    }
}