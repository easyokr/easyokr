const jwt = require('jsonwebtoken');

module.exports = async function (ctx, next) {
    
    if (ctx.request.url.indexOf('login') == -1) {
        const token = ctx.header.token
        if (token) {
            const uid = jwt.verify(token, 'easyokr').uid;
            ctx.header.uid = uid
        }
        
    }

    await next()

}