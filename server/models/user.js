const Sequelize = require('sequelize');
const sequelize = require('./database');

const user = sequelize.define('user', {
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
}, {
    timestamps: false,
    tableName: 'okr_user'
});

module.exports = user;