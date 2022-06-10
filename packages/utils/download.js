const ora = require('ora')
const exists = require('fs').existsSync
const rm = require('rimraf').sync
const downloadGit = require('download-git-repo')
const templates = require('../config/template')

/**
 * 下载应用模板
 * @param {string} template 模板名
 * @param {string} dir 下载目录
 */
module.exports = function download(template, dir) {
    const spinner = ora('正在下载模板...');
    spinner.start()

    if (exists(dir)) rm(dir)

    // 使用git clone经常出现各种错误，改为http下载zip
    return new Promise((resolve) => {
        const config = templates[template]
        downloadGit(config.url, dir, (error) => {
            if (error) {
                spinner.fail('模板下载失败！')
                resolve(false)
            }
            else {
                spinner.succeed('模板下载完成')
                resolve(true)
            }
        })
    })
}