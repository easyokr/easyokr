const router = require('koa-router')({
    prefix: '/rs'
})
const controllers = require('../controllers')

router.post('/login', controllers.account.login)
router.post('/info', controllers.account.info)
router.get('/status', controllers.okrs.status)
router.get('/tree', controllers.okrs.tree)
router.post('/create', controllers.okrs.create)
router.get('/my', controllers.okrs.my)
router.get('/search', controllers.okrs.search)
router.get('/stages', controllers.okrs.stages)
router.get('/teams', controllers.okrs.teams)
router.get('/parents', controllers.okrs.parents)
module.exports = router