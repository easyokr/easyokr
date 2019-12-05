const Sequelize = require('sequelize');
const sequelize = require('./database');
const objective = require('./objective');

const keyResult = sequelize.define('key_result', {
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    oid: Sequelize.BIGINT(11),
    name: Sequelize.STRING,
    score: Sequelize.INTEGER,
}, {
    timestamps: false,
    tableName: 'okr_key_result'
});

keyResult.belongsTo(objective, { foreignKey: 'oid', targetKey: 'id', as: 'o' });

module.exports = keyResult;