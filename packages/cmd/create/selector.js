const request = require('node-fetch')
const config = require('../../config')
const ask = require('../../utils/ask')

/**
 * 选择模板类型
 * @returns 
 */
module.exports = async function selector() {
    // 下载配置文件
    const response = await request(config.templateUrl)
    const templates = await response.json()

    // 询问
    const questions = {
        template: {
            type: 'list',
            message: '请选择创建的应用类型',
            choices: Object.keys(templates).map(key => ({
                name: templates[key].name,
                value: key
            }))
        }
    }
    const answers = {}
    await ask(questions, answers)

    return {
        code: answers.template,
        ...templates[answers.template]
    }
}