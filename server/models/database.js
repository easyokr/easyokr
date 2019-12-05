
const Sequelize = require('sequelize');
const config = require('../config');


const sequelize = new Sequelize(config.sql.database, config.sql.user, config.sql.password, {
    host: config.sql.host,
    port: config.sql.port,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 2,
        idle: 10
    }
});

module.exports = sequelize;
