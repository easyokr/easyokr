const _ = require('lodash')
const fs = require('fs')
const path = require('path')


const mapDir = d => {
    const tree = {}
    const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())

    dirs.forEach(dir => {
        tree[dir] = mapDir(path.join(d, dir))
    })

    files.forEach(file => {
        if (path.extname(file) === '.js') {
            tree[path.basename(file, '.js')] = require(path.join(d, file))
        }
    })

    return tree
}

module.exports = mapDir(path.join(__dirname))