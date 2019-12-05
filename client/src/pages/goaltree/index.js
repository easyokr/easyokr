import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import axios from 'axios';
import Graph from './graph';
import './index.css';

class GoalTree extends Component {
    constructor() {
        super()
        this.state = {
            goals: []
        }
    }

    componentDidMount() {
        const token = this.props.token.token
        if (token) {
            axios({
                method: "GET",
                url: `http://localhost:3001/rs/tree`,
                headers: {
                    token: this.props.token.token
                }
            }).then(res => {
                this.setState({
                    goals: res.data.data
                })

                const graph = Graph('container')
                graph.data(res.data.data);
                graph.render();
                graph.fitView();
                graph.zoom(0.38);
            })
        }

    }

    render() {
        return (
            <div className="canvas box">
                <Card style={{ width: '100%' }} title="目标树">
                    <div id="container"></div>
                </Card>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.token,
        edit: state.edit
    }
}


export default connect(mapStateToProps)(GoalTree)