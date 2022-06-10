const path = require('path')
const exists = require('fs').existsSync


/**
 * 获取模板元数据信息
 * @param {string} name 应用名 
 * @param {string} dir  模板目录
 * @returns 
 */
module.exports = function getMetaData(name, dir) {
    const opts = readMetaData(dir)

    setDefault(opts, 'name', name)

    return opts
}

/**
 * 读取模板中meta.js
 * @param {string} dir 模板目录 
 */
function readMetaData(dir) {
    const js = path.join(dir, 'meta.js')
    let opts = {}

    if (exists(js)) {
        const req = require(path.resolve(js))
        if (req !== Object(req)) {
            throw new Error('meta.js 必须导出为对象')
        }
        opts = req
    }
    return opts
}

/**
 * 设置prompt默认值
 *
 * @param {Object} opts
 * @param {String} key
 * @param {String} val
 */
function setDefault(opts, key, val) {
    const prompts = opts.prompts || (opts.prompts = {})
    if (!prompts[key] || typeof prompts[key] !== 'object') {
        prompts[key] = {
            'type': 'string',
            'default': val
        }
    } else {
        prompts[key]['default'] = val
    }
}