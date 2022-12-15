import { BarcodeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';

const Permission = () => {
    let navigate = useNavigate();
    const { getListPermission } = useContext(AppContext);
    const [data, setData] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    useEffect(() => {
        setLoadingTable(true);
        getListPermission().then((res) => {
            if (res.data.status) {
                setData(res.data.data);
            }
            setLoadingTable(false)
        });
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" size="small" onClick={() => update(record)}><EditOutlined /></Button>
                    <Popconfirm title="Xóa tài khoản này?" placement="leftTop" onConfirm={() => remove(record)}>
                        <Button type="link" size="small" danger><DeleteOutlined /></Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const update = (record) => {
        navigate(`/admin/permission/detail/${record.id}`)
    }
    const remove = (record) => {
        setLoadingTable(true)
        deleteCinema(record.id).then((res) => {
            let newItems = data.filter(item => item.id !== record.id)
            setData(newItems)
            openNotification(res.data);
            setLoadingTable(false)
        })
    }
    return (
        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Permission</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
                <Button type='primary' style={{ marginBottom: '16px' }}><Link to="/admin/permission/detail?action=add">Thêm quyền</Link></Button>
                <Table
                    bordered
                    scroll={{ x: 980 }}
                    columns={columns}
                    dataSource={data}
                    rowKey='id'
                    loading={loadingTable}
                />
            </div>
        </>
    )
}

export default Permission