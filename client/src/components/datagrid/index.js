import React, { Component } from 'react';
import { Badge, Tag, Radio, Table, Menu, Dropdown, Icon, Avatar } from 'antd';
import './index.css'

class DataGrid extends Component {

    render() {


        const expandedRowRender = (record, index, indent, expanded) => {
            const columns = [
                {
                    title: 'Name', dataIndex: 'name', key: 'name', render: (text, record, index) => (
                        <div><Tag color="red">{'KR' + (index + 1)}</Tag>{text}</div>
                    )
                },
                {
                    title: '评分',
                    dataIndex: 'operation',
                    key: 'operation',
                    width: '360px',
                    render: (text, record, index) => {
                        if (record.editable) {
                            return (
                                <Radio.Group defaultValue={record.score} buttonStyle="solid" size="small">
                                    <Radio.Button className="green" key={10} value={10}>出色完成</Radio.Button>
                                    <Radio.Button className="yellow" key={7} value={7}>基本完成</Radio.Button>
                                    <Radio.Button className="red" key={3} value={3}>未完成</Radio.Button>
                                </Radio.Group>
                            )
                        } else {
                            return (<div style={{ textAlign: 'right', paddingRight: '100px' }}>
                                <Tag color={record.color == 'red' ? '#f5222d' : record.color == 'yellow' ? '#fadb14' : record.color == 'green' ? '#52c41a' : '#333'} >

                                    {(record.score / 10).toFixed(1)}
                                </Tag>
                            </div>)
                        }
                    },
                },
            ];

            return <Table columns={columns} rowKey="id" dataSource={record.krs} key={index} pagination={false} showHeader={false} />;
        };

        const columns = [
            {
                title: '负责人', dataIndex: 'u.name', key: 'user', render: text => (
                    <div><Avatar size="small" style={{ marginRight: '10px', backgroundColor: '#eb2f96' }}>{text.substring(0, 1)}</Avatar>{text}</div>
                )
            },
            {
                title: '目标', dataIndex: 'name', key: 'name', width: '60%', render: (text, record, index) => (
                    <div><Tag color="red">{record.type === 1 ? '个人' : record.type === 2 ? '团队' : record.type == 3 ? '公司' : ''}</Tag>{text}</div>
                )
            },
            {
                title: '得分', dataIndex: 'score', key: 'score', render: (text, record, index) => (
                    <div><Tag color={record.color} >{(record.score / 10).toFixed(1)}</Tag></div>
                )
            },
        ];


        return (
            <Table
                key={this.props.akey}
                className="components-table-demo-nested"
                columns={columns}
                rowKey="id"
                expandedRowRender={expandedRowRender}
                dataSource={this.props.data}
                pagination={false}
                indentSize={50}
            />

        );
    }
}


export default DataGrid