const jwt = require('jsonwebtoken');
const Objective = require('../models/objective');
const KeyResult = require('../models/key_result');
const User = require('../models/user');
const Sequelize = require('sequelize');
const sequelize = require('../models/database');
const Op = Sequelize.Op


module.exports = {

    create: async ctx => {
        const data = ctx.request.body
        if (!data.parent) {
            data.parent = null
        }
        const obj = await Objective.create({
            ...data,
            uid: ctx.header.uid
        })

        for (const kr of data.krs) {
            KeyResult.create({
                name: kr,
                oid: obj.get('id')
            })
        }

        ctx.state.data = obj
    },

    my: async ctx => {
        const uid = ctx.header.uid

        const user = await User.findOne({
            where: { id: uid },
            raw: true
        })

        const objs = await Objective.findAll({
            where: { uid },
            raw: true
        })


        for (obj of objs) {
            const krs = await KeyResult.findAll({
                where: { oid: obj.id },
                raw: true
            });

            obj.krs = krs
            obj['u.name'] = user.name
            let sum = 0
            let count = 0
            for (const kr of krs) {
                sum += kr.score
                count += kr.score > 0 ? 1 : 0
                kr.color = kr.score == 10 ? 'green' : kr.score >= 7 ? 'yellow' : kr.score > 0 ? 'red' : 'gray'
                kr.editable = obj.uid == uid
            }

            score = count > 0 ? sum / count : 0
            obj.score = score
            obj.color = score == 10 ? 'green' : score >= 7 ? 'yellow' : score > 0 ? 'red' : 'gray'
            obj.krs = krs
        }

        ctx.state.data = objs
    },

    parents: async ctx => {
        const objs = await Objective.findAll({
            include: [{
                model: User,
                as: 'u',
                attributes: ['name']
            }],
            where: {},
            raw: true
        })

        ctx.state.data = objs
    },

    search: async ctx => {
        const data = ctx.request.query
        const condition = []

        if (data.query) {
            condition.push({
                [Op.or]: [
                    {
                        '$u.name$': {
                            [Op.like]: `%${data.query}%`
                        }
                    },
                    {
                        'name': {
                            [Op.like]: `%${data.query}%`
                        }
                    }
                ]
            })
        }

        if (data.type * 1) {
            condition.push({
                type: data.type
            })
        }

        const objs = await Objective.findAll({
            where: condition,
            include: [{
                model: User,
                as: 'u',
                attributes: ['name']
            }],
            raw: true
        })
        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i];
            const krs = await KeyResult.findAll({
                where: { oid: obj.id },
                raw: true
            });

            let sum = 0
            let count = 0
            for (const kr of krs) {
                sum += kr.score
                count += kr.score > 0 ? 1 : 0
                kr.color = kr.score == 10 ? 'green' : kr.score >= 7 ? 'yellow' : kr.score > 0 ? 'red' : 'gray'
            }

            score = count > 0 ? sum / count : 0
            obj.score = score
            obj.color = score == 10 ? 'green' : score >= 7 ? 'yellow' : score > 0 ? 'red' : 'gray'
            obj.krs = krs
        }

        ctx.state.data = objs
    },

    stages: async ctx => {
        const sql = `SELECT DISTINCT stage from okr_objective where stage is not null and stage <>''`

        const stages = await sequelize.query(sql, { raw: true })
        ctx.state.data = stages[0].map(r => r.stage)
    },

    teams: async ctx => {
        const sql = `SELECT DISTINCT team from okr_objective where team is not null and team <>''`

        const teams = await sequelize.query(sql, { raw: true })
        ctx.state.data = teams[0].map(r => r.team)
    },

    status: async ctx => {
        const now = new Date()
        const year = now.getFullYear()
        let quarter = 0
        switch (now.getMonth()) {
          case 0:
          case 1:
          case 2:
            quarter = 1;
            break;
          case 3:
          case 4:
          case 5:
            quarter = 2;
            break;
          case 6:
          case 7:
          case 8:
            quarter = 3;
            break;
          case 9:
          case 10:
          case 11:
            quarter = 4;
            break;
          default:
        }
        const sql = `SELECT o.id,o.type, INTERVAL(avg(IFNULL(kr.score ,0)), 1,7,10,11) as st FROM okr_objective o 
            LEFT JOIN okr_key_result kr ON o.id = kr.oid WHERE o.stage = '${year}年Q${quarter}' GROUP BY o.id`

        const objs = await sequelize.query(sql, { raw: true })
        const counts = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

        for (const obj of objs[0]) {
            counts[obj.type - 1][obj.st]++
        }

        ctx.state.data = {
            personal: [{
                count: counts[0][3],
                color: 'green'
            },
            {
                count: counts[0][2],
                color: 'yellow'
            },
            {
                count: counts[0][1],
                color: 'red'
            },
            {
                count: counts[0][0],
                color: 'gray'
            }],
            team: [{
                count: counts[1][3],
                color: 'green'
            },
            {
                count: counts[1][2],
                color: 'yellow'
            },
            {
                count: counts[1][1],
                color: 'red'
            },
            {
                count: counts[1][0],
                color: 'gray'
            }],
            company: [{
                count: counts[2][3],
                color: 'green'
            },
            {
                count: counts[2][2],
                color: 'yellow'
            },
            {
                count: counts[2][1],
                color: 'red'
            },
            {
                count: counts[2][0],
                color: 'gray'
            }],
        }
    },

    tree: async ctx => {
        const tree = {
            "id": "0",
            "name": "OKRs",
            "type": "root",
            "children": []
        }

        const all = await Objective.findAll({ raw: true })
        for (const obj of all) {
            const krs = await KeyResult.findAll({
                where: { oid: obj.id },
                attributes: ['score'],
                raw: true
            });
            let sum = 0
            let count = 0
            for (const kr of krs) {
                sum += kr.score
                count += kr.score > 0 ? 1 : 0
            }

            score = count > 0 ? sum / count : 0
            obj.score = score
            obj.color = score == 10 ? 'green' : score >= 7 ? 'yellow' : score > 0 ? 'red' : 'gray'
        }

        var traverse = function (data, parent) {
            var items = [];
            for (var i = 0; i < data.length; i++) {
                var node = data[i];
                if (node.parent == parent) {
                    const children = traverse(data, node.id);
                    var collapsed = { ...node, children, collapsed: true };
                    items.push(collapsed);
                }
            }
            return items;
        }

        tree.children = traverse(all, null)

        ctx.state.data = tree

    }

}

