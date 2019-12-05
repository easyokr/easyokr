import React, { Component } from 'react';
import { Icon, Modal, Form, Input, Button, Row, Col, Select, AutoComplete, message } from 'antd';
import axios from 'axios';


let id = 0;

class GoalForm extends Component {

  constructor() {
    super()
    this.state = {
      type: 1,
      teams: [],
      objs: [],
    }
  }

  handleTypeChange = (v) => {
    this.setState({
      type: v
    })
  }

  update = (e, id) => {
    const { form } = this.props;
    const v = e.target.value
    const krs = form.getFieldValue('krs');
    for (let i = 0; i < krs.length; i++) {
      const key = krs[i]
      if (key.id === id) {
        key.kr = v
      }
    }

    form.setFieldsValue({
      krs
    });

  };
  remove = k => {
    const { form } = this.props;
    const krs = form.getFieldValue('krs');
    if (krs.length === 1) {
      return;
    }
    form.setFieldsValue({
      krs: krs.filter(key => key.id !== k.id),
    });
  };

  add = () => {
    const { form } = this.props;
    const krs = form.getFieldValue('krs');
    id++
    const nextkrs = krs.concat({
      id,
      kr: ''
    });
    form.setFieldsValue({
      krs: nextkrs,
    });
  };

  submit = () => {
    this.props.form.validateFields((err, values) => {
      console.log(values)
      values.krs = values.krs.map(kr => kr.kr)

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

      if (!err) {
        axios({
          method: "POST",
          url: `http://localhost:3001/rs/create`,
          headers: {
            token: this.props.token.token
          },
          data: { ...values, stage: `${year}年Q${quarter}` }
        }).then(res => {
          if (res.data.code === 0) {
            message.info('创建成功');
            this.props.form.resetFields()
            this.add()
            this.props.form.setFieldsValue({
              type: this.state.type
            })
          } else {
            message.error('创建失败');
          }
        })
      }
    });
  };

  componentDidMount() {
    this.add()
    this.props.form.setFieldsValue({
      type: this.state.type
    })

    const token = this.props.token.token
    if (token) {
      axios({
        method: "GET",
        url: `http://localhost:3001/rs/teams`,
        headers: {
          token: this.props.token.token
        },
      }).then(res => {
        this.setState({
          teams: res.data.data
        })
      })

      axios({
        method: "GET",
        url: `http://localhost:3001/rs/parents`,
        headers: {
          token: this.props.token.token
        },
      }).then(res => {
        this.setState({
          objs: res.data.data
        })
      })
    }

  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('krs', { initialValue: [] });
    const krs = getFieldValue('krs');
    const formItems = krs.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '关键结果' : ''}
        labelAlign="left"
        required={true}
        key={k.id}
      >
        <Input placeholder="请输入关键结果" value={k.kr} style={{ width: '90%', marginRight: 8 }} onChange={e => this.update(e, k.id)} />
        {krs.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Modal
        visible={this.props.show}
        title="创建目标"
        okText="创建"
        cancelText="取消"
        onCancel={this.props.onCancel}
        onOk={this.submit}
      >
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} labelAlign="left" label="目标类型">
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择目标类型' }],
                })(
                  <Select
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请选择目标类型"
                    optionFilterProp="children"
                    onChange={this.handleTypeChange}
                  >
                    <Select.Option key={1} value={1}>个人</Select.Option>
                    <Select.Option key={2} value={2}>团队</Select.Option>
                    <Select.Option key={3} value={3}>公司</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} labelAlign="left" label="目标周期">
                <Input value={this.props.stage} readOnly disabled />
              </Form.Item>
            </Col>
          </Row>
          {(() => {
            if (this.state.type === 2) {
              return (
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} labelAlign="left" label="团队名称">
                  {getFieldDecorator('team', {
                    rules: [{ required: true, message: '请输入或选择团队名称' }],
                  })(
                    <AutoComplete
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="请输入或选择团队名称" dataSource={this.state.teams} />
                  )}
                </Form.Item>)
            }
          })()}

          <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} labelAlign="left" label="目标名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入目标名称' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入目标"
              />,
            )}
          </Form.Item>
          {formItems}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '90%' }}>
              <Icon type="plus" /> 添加关键结果
          </Button>
          </Form.Item>
          <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} labelAlign="left" label="支撑目标">
            {getFieldDecorator('parent', {
            })(
              <Select
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请选择父目标"
                optionFilterProp="children"
                showSearch
              >
                <Select.Option key={0}>请选择</Select.Option>
                {this.state.objs.map(d => <Select.Option key={d.id}>{`【${d['u.name']}】${d.name}`}</Select.Option>)}
              </Select>,
            )}
          </Form.Item>

        </Form>

      </Modal>
    );
  }
}


export default Form.create({ name: 'create_okr' })(GoalForm)