const path = require('path')
const home = require('user-home')
const templates = require('../config/template')
const ask = require('../utils/ask')
const download = require('../utils/download')
const compile = require('../utils/compile')

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

/**
 * 创建微应用
 * @param {string} dir 应用目录名
 */
async function create(dir) {
    // 选择应用类型
    const answers = {}
    await ask(questions, answers)

    // 下载应用模板
    const src = path.join(home, ".zhfc-templates", dir)
    let succeed = await download(answers.template, src)
    if (!succeed) return

    // 编译应用模板
    const dest = path.join(process.cwd(), dir)
    await compile(dir, src, dest)
}

module.exports = create