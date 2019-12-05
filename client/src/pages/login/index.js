import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { withRouter } from 'react-router';
import { Spin, Icon, Form, Input, Button, message } from 'antd';
import './index.css';


class Login extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            userpass: '',
            loading: false
        }
    }

    handleUsernameChange(e) {
        this.setState({
            username: e.target.value
        })
    }

    handleUserpassChange(e) {
        this.setState({
            userpass: e.target.value
        })
    }

    login = async () => {
        const { history } = this.props
        const { username, userpass } = this.state
        this.setState({
            loading: true
        })
        axios.post('http://localhost:3001/rs/login', { username, userpass }).then(res => {
            if (res.data.code === 0) {
                setTimeout(() => {
                    const token = res.data.data
                    this.props.setToken(token)
                    history.replace('/mygoal')
                }, 500);
            } else {
                message.info('验证失败请重试');
            }
        }).finally(() => {
            this.setState({
                loading: false
            })
        })

    }

    render() {
        return (
            <Spin spinning={this.state.loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                <div className="container">
                    <Form className="login-form">
                        <div className="logo">EASYOKR</div>
                        <Form.Item>
                            <Input value={this.state.username}
                                onChange={e => this.handleUsernameChange(e)}
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="邮箱"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input value={this.state.userpass}
                                onChange={e => this.handleUserpassChange(e)}
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={this.login} type="primary" htmlType="submit" className="login-form-button">
                                登陆
                        </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.token
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setToken: (token) => dispatch({ 'type': 'login', token })
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))

