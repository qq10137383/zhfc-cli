const ora = require('ora')
const path = require('path')
const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const ask = require('../../utils/ask')
const logger = require('../../utils/logger')
const meta = require('./meta')
const filter = require('./filter')

// 注册handlebars helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b
        ? opts.fn(this)
        : opts.inverse(this)
})
Handlebars.registerHelper('unless_eq', function (a, b, opts) {
    return a === b
        ? opts.inverse(this)
        : opts.fn(this)
})

/**
 * 编译模板
 * @param {string} name 应用名
 * @param {string} src 模板下载目录
 * @param {string} dest 生成目录
 */
module.exports = function compile(name, src, dest) {
    const spinner = ora();

    // 获取模板元数据
    const opts = meta(name, src)

    // 注册handlebars helper
    opts.helpers && Object.keys(opts.helpers).map(key => {
        Handlebars.registerHelper(key, opts.helpers[key])
    })

    // 创建模板编译引擎
    const metalsmith = Metalsmith(path.join(src, "template"))
    const data = Object.assign(metalsmith.metadata(), {
        destDirName: name
    })

    // 调用metalsmith before钩子函数
    const helpers = { chalk, logger }
    if (opts.metalsmith && typeof opts.metalsmith.before === 'function') {
        opts.metalsmith.before(metalsmith, opts, helpers)
    }

    // 注册metalsmith中间件
    metalsmith
        .use(askQuestions(opts.prompts))
        .use(startSpinner(spinner))
        .use(filterFiles(opts.filters))
        .use(renderTemplateFiles())

    // 调用metalsmith、after钩子函数
    if (typeof opts.metalsmith === 'function') {
        opts.metalsmith(metalsmith, opts, helpers)
    } else if (opts.metalsmith && typeof opts.metalsmith.after === 'function') {
        opts.metalsmith.after(metalsmith, opts, helpers)
    }

    // 编译模板
    return new Promise((resolve) => {
        metalsmith
            .clean(true)
            .source('.')
            .destination(dest)
            .build((error, files) => {
                if (error) {
                    spinner.fail('模板编译失败！')
                    console.log(error)
                    resolve(false)
                }
                else {
                    spinner.succeed('模板编译完成')
                    // 回调complete钩子
                    if (opts.complete && typeof opts.complete === 'function') {
                        opts.complete(data, { chalk, logger, files })
                    }
                    resolve(true)
                }
            })
    })
}

/**
 * 提问中间件
 * @param {Object} prompts
 * @return {Function}
 */
function askQuestions(prompts) {
    return (files, metalsmith, done) => {
        ask(prompts, metalsmith.metadata()).then(done)
    }
}

/**
 * 编译提示中间件
 * @param {Ora} spinner 
 * @returns 
 */
function startSpinner(spinner) {
    return (files, metalsmith, done) => {
        spinner.text = '开始编译模板...'
        spinner.start()
        done()
    }
}

/**
 * 文件过滤中间件
 * @param {Array} filters 
 */
function filterFiles(filters) {
    return (files, metalsmith, done) => {
        filter(files, filters, metalsmith.metadata(), done)
    }
}

/**
 * 编译文件中间件
 */
function renderTemplateFiles() {
    return (files, metalsmith, done) => {
        const keys = Object.keys(files)
        const data = metalsmith.metadata()
        for (let file of keys) {
            const str = files[file].contents.toString()
            // 没有mustaches表单式的文件跳过
            if (!/{{([^{}]+)}}/g.test(str)) {
                continue
            }
            const template = Handlebars.compile(str)
            const res = template(data)
            files[file].contents = Buffer.from(res)
        }
        done()
    }
}