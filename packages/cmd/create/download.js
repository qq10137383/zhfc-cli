const ora = require('ora')
const exists = require('fs').existsSync
const rm = require('rimraf').sync
const downloadGit = require('download-git-repo')

/**
 * 下载模板文件
 * @param {string} url 文件路径
 * @param {string} dir 下载目录
 */
module.exports = function download(url, dir) {
    const spinner = ora('正在下载模板...');
    spinner.start()

    if (exists(dir)) rm(dir)

    // 使用git clone经常出现各种错误，改为http下载zip
    return new Promise((resolve) => {
        downloadGit(url, dir, (error) => {
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