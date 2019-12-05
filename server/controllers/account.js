const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
    login: async ctx => {
        const params = ctx.request.body

        const user = await User.findOne({
            where: {
                email: params.username,
                password: params.userpass
            }
        })

        if (user) {
            const get = user.get()
            var token = jwt.sign({ 'uid': get.id }, 'easyokr');
            ctx.state.data = token
        } else {
            ctx.state.code = -1
        }
    },


    info: async ctx => {
        ctx.state.data = ctx.header.uid
    }
}

