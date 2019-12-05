import React, { Component } from 'react';
import { Layout, Menu, Icon, Button, PageHeader, Select } from 'antd';
import { withRouter, Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import MyGoals from '../mygoals';
import AllGoals from '../allgoals';
import GoalTree from '../goaltree';
import GoalForm from './components/goal_form'
import Login from '../login';
import './index.css';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

class Welcome extends Component {

  constructor() {
    super()
    this.state = {
      edit: false,
      stages: []
    }
  }

  componentDidMount() {
    const { token, history } = this.props

    if (!token || Object.keys(token).length === 0) {
      history.push('/login')
    } else {
      axios({
        method: "GET",
        url: `http://localhost:3001/rs/stages`,
        headers: {
          token: this.props.token.token
        },
      }).then(res => {
        const stages = res.data.data
        this.setState({
          stages: stages
        })

        this.props.handleStageChange(stages[stages.length - 1])

      })
    }


  }

  render() {
    return (
      <div>
        <GoalForm
          show={this.state.edit}
          onCancel={() => { this.setState({ edit: false }) }}
          stage={this.props.stage.stage}
          token={this.props.token}></GoalForm>
        <Layout>
          <Sider
            width={256}
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <div className="sider-menu-logo"><img src="/logo.svg"></img><h1>EASY OKR</h1></div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link to="/mygoal">
                  <Icon type="user" />
                  <span className="nav-text">我的目标</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/allgoal">
                  <Icon type="search" />
                  <span className="nav-text">全部目标</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/goaltree">
                  <Icon type="apartment" />
                  <span className="nav-text">目标关系</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 256 }}>
            <Header style={{ background: '#fff', padding: 0 }}>
              <PageHeader
                ghost={false}
                backIcon={false}
                extra={[
                  <Button key="1" type="primary" icon="plus" onClick={() => { this.setState({ edit: true }) }}>创建目标</Button>,
                  <Select
                    value={this.props.stage.stage}
                    style={{ marginLeft: 20, width: 150 }}
                    onChange={this.props.handleStageChange}
                    key="stages"
                    optionFilterProp="children"
                  >
                    {this.state.stages.map((item, index) => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>,
                ]}
              ></PageHeader>
            </Header>
            <Content style={{ overflow: 'initial' }}>
              <Route exact path="/" component={Login} />
              <Route exact path="/mygoal" component={MyGoals} />
              <Route path="/allgoal" component={AllGoals} />
              <Route path="/goaltree" component={GoalTree} />
            </Content>
          </Layout>
        </Layout>
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

function mapDispatchToProps(dispatch) {
  return {
    handleStageChange: (value) => {
      dispatch({ type: 'update', stage: value })
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Welcome))



































