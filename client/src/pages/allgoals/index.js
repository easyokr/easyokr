import React, { Component } from 'react';
import { Input, Icon, Spin } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import { Tabs } from 'antd';
import './index.css';
import DataGrid from '../../components/datagrid';

const { TabPane } = Tabs;

class AllGoals extends Component {
    constructor() {
        super()
        this.state = {
            goals: [],
            query: '',
            loading: false,
            type: 0
        }
    }

    handleEnterKey = (e) => {
        if (e.nativeEvent.keyCode === 13) {
            const query = this.state.query
            const type = this.state.type
            this.search({ query, type })
        }
    }

    handleQueryChange = (e) => {
        this.setState({ query: e.target.value });
    }

    handleTabChange = (tab) => {
        this.setState({ type: tab, query: '' });
        this.search({ type: tab })
    }

    componentDidMount() {
        this.search({})
    }

    search = async (data) => {
        const query = data.query ? data.query : ''
        const type = data.type ? data.type : ''
        const token = this.props.token.token
        if (token) {
            this.setState({ loading: true })

            axios({
                method: "GET",
                url: `http://localhost:3001/rs/search?query=${query}&type=${type}`,
                headers: {
                    token: this.props.token.token
                }
            }).then(res => {
                this.setState({
                    goals: res.data.data
                })
            }).finally(() => {
                this.setState({ loading: false })
            })
        }

    }


    render() {

        return (
            <Tabs onChange={this.handleTabChange} defaultActiveKey="0" tabBarStyle={{ backgroundColor: '#ffffff', paddingLeft: '20px' }}>
                <TabPane tab="全部" key="0">
                    <Spin spinning={this.state.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                        <div className="tabpanel">
                            <div style={{ width: '25%', padding: 20, }}>
                                <Input
                                    value={this.state.query}
                                    onKeyPress={this.handleEnterKey}
                                    onChange={this.handleQueryChange}
                                    placeholder="搜索员工或目标"
                                    prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                />
                            </div>
                            <DataGrid data={this.state.goals} akey="all"></DataGrid>
                        </div>
                    </Spin>
                </TabPane>

                <TabPane tab="个人" key="1">
                    <Spin spinning={this.state.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                        <div className="tabpanel"><div style={{ width: '25%', padding: 20, }}>
                            <Input
                                value={this.state.query}
                                onKeyPress={this.handleEnterKey}
                                onChange={this.handleQueryChange}
                                placeholder="搜索员工或目标"
                                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </div>
                            <DataGrid data={this.state.goals} akey="personal"></DataGrid>
                        </div>
                    </Spin>
                </TabPane>
                <TabPane tab="团队" key="2">
                    <Spin spinning={this.state.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                        <div className="tabpanel"><div style={{ width: '25%', padding: 20, }}>
                            <Input
                                value={this.state.query}
                                onKeyPress={this.handleEnterKey}
                                onChange={this.handleQueryChange}
                                placeholder="搜索员工或目标"
                                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </div>
                            <DataGrid data={this.state.goals} akey="team"></DataGrid>
                        </div>
                    </Spin>
                </TabPane>
                <TabPane tab="公司" key="3">
                    <Spin spinning={this.state.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                        <div className="tabpanel"><div style={{ width: '25%', padding: 20, }}>
                            <Input
                                value={this.state.query}
                                onKeyPress={this.handleEnterKey}
                                onChange={this.handleQueryChange}
                                placeholder="搜索员工或目标"
                                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </div>
                            <DataGrid data={this.state.goals} akey="company"></DataGrid>
                        </div>
                    </Spin>
                </TabPane>
            </Tabs>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.token
    }
}


export default connect(mapStateToProps)(AllGoals)