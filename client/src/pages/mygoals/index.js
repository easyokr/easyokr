import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import axios from 'axios';
import Pie from './components/pie'
import { connect } from 'react-redux';
import DataGrid from '../../components/datagrid';


class MyGoals extends Component {

    constructor() {
        super()
        this.state = {
            personal: [],
            team: [],
            company: [],
            goals: []
        }
    }

    componentDidMount() {
        const { token, stage } = this.props
        if (token.token) {
            axios({
                method: "GET",
                url: `http://localhost:3001/rs/status`,
                headers: {
                    token: token.token
                }
            }).then(res => {
                this.setState({
                    personal: res.data.data.personal,
                    team: res.data.data.team,
                    company: res.data.data.company
                })
            })

            axios({
                method: "GET",
                url: `http://localhost:3001/rs/my`,
                headers: {
                    token: token.token
                }
            }).then(res => {
                this.setState({
                    goals: res.data.data
                })
            })
        }
    }


    render() {


        return (
            <div className="box">

                <Card style={{ width: '100%' }} title="完成情况">
                    <Row>
                        <Col span={8}>
                            <Pie data={this.state.personal} title="个人" height={150}></Pie>
                        </Col>
                        <Col span={8}>
                            <Pie data={this.state.team} title="团队" height={150}></Pie>
                        </Col>
                        <Col span={8}>
                            <Pie data={this.state.company} title="公司" height={150}></Pie>
                        </Col>
                    </Row>

                </Card>

                <Card style={{ width: '100%', marginTop: '20px' }} bodyStyle={{ padding: '0' }} title="我的目标">
                    <DataGrid data={this.state.goals} key="my"></DataGrid>
                </Card>

            </div>


        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.token,
        stage: state.stage
    }
}


export default connect(mapStateToProps)(MyGoals)