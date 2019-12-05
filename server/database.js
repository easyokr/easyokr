const Objective = require('./models/objective');
const KeyResult = require('./models/key_result');
const User = require('./models/user');
const sequelize = require('./models/database');

(async function () {

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
    await User.sync({ force: true })
    await Objective.sync({ force: true })
    await KeyResult.sync({ force: true })
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true })

    console.log('database sync completed!')
})()


