const path = require('path')
const home = require('user-home')
const selector = require('./selector')
const download = require('./download')
const compile = require('./compile')

/**
 * 创建微应用
 * @param {string} dir 应用目录名
 */
async function create(dir) {
    // 选择应用类型
    const template = await selector()

    // 下载应用模板
    const src = path.join(home, ".zhfc-templates", dir)
    let succeed = await download(template.url, src)
    if (!succeed) return

    // 编译应用模板
    const dest = path.join(process.cwd(), dir)
    await compile(dir, src, dest)
}

module.exports = create