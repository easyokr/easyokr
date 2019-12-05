const Sequelize = require('sequelize');
const sequelize = require('./database');
const user = require('./user');

const objective = sequelize.define('objective', {
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    uid: Sequelize.BIGINT(11),
    type: Sequelize.INTEGER,
    parent: Sequelize.BIGINT(11),
    name: Sequelize.STRING,
    stage: Sequelize.STRING,
    team: Sequelize.STRING,
}, {
    timestamps: false,
    tableName: 'okr_objective'
});

objective.belongsTo(user, { foreignKey: 'uid', targetKey: 'id', as: 'u' });
module.exports = objective;