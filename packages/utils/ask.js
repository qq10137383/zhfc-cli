const async = require('async')
const inquirer = require('inquirer')
const evaluate = require('./eval')

// prompt 类型映射
const promptMapping = {
    string: 'input',
    boolean: 'confirm'
}

/**
 * 提问，返回答案
 *
 * @param {Object} prompts
 * @param {Object} data
 */

module.exports = function ask(prompts, data) {
    return async.eachSeries(Object.keys(prompts), (key, next) => {
        prompt(data, key, prompts[key], next)
    })
}

/**
 * Inquirer包装方法，增加前后提问关联关系、默认值设置
 *
 * @param {Object} data
 * @param {String} key
 * @param {Object} prompt
 * @param {Function} done
 */

function prompt(data, key, prompt, done) {
    // 执行when表达式，不满足条件就跳过提问
    if (prompt.when && evaluate(prompt.when, data)) {
        return done()
    }

    // 执行default表达式，设置默认值
    let promptDefault = prompt.default
    if (typeof prompt.default === 'function') {
        promptDefault = function () {
            return prompt.default.bind(this)(data)
        }
    }

    // 提问返回答案
    inquirer.prompt([{
        type: promptMapping[prompt.type] || prompt.type,
        name: key,
        message: prompt.message || prompt.label || key,
        default: promptDefault,
        choices: prompt.choices || [],
        validate: prompt.validate || (() => true)
    }]).then(answers => {
        if (Array.isArray(answers[key])) {
            data[key] = {}
            answers[key].forEach(multiChoiceAnswer => {
                data[key][multiChoiceAnswer] = true
            })
        } else if (typeof answers[key] === 'string') {
            data[key] = answers[key].replace(/"/g, '\\"')
        } else {
            data[key] = answers[key]
        }
        done()
    }).catch(done)
}
