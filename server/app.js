const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('eos-invite')
const response = require('./middlewares/response')
const request = require('./middlewares/request')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const router = require('./routes')
const cors = require('koa2-cors');

app.use(request)
app.use(response)
app.use(bodyParser())
app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token'],
}))
app.use(router.routes())

app.listen(config.port, () => debug(`listening on port ${config.port}`))