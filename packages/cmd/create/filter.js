const match = require('minimatch')
const evaluate = require('../../utils/eval')

/**
 * 文件过滤
 * @param {Array} files 
 * @param {Array} filters 
 * @param {Object} data 
 * @param {Function} done 
 */
module.exports = function filter(files, filters, data, done) {
    if (!filters) {
        return done()
    }
    const fileNames = Object.keys(files)
    Object.keys(filters).forEach(glob => {
        fileNames.forEach(file => {
            if (match(file, glob, { dot: true })) {
                const condition = filters[glob]
                if (!evaluate(condition, data)) {
                    delete files[file]
                }
            }
        })
    })
    done()
}