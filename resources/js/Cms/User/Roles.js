import { BarcodeOutlined, DeleteOutlined, EditOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Drawer, Image, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';
import RolePermisson from './Role/RolePermisson';

const Roles = () => {
    let navigate = useNavigate();
    const { getListRole } = useContext(AppContext);
    const [data, setData] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [open, setOpen] = useState(false);
    const [itemCP, setItemCP] = useState({});


    useEffect(() => {
        setLoadingTable(true);
        getListRole().then((res) => {
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
            title: 'Guardname',
            dataIndex: 'guard_name',
            key: 'guard_name',
            width: 200,

        },
        {
            title: 'Acl',
            dataIndex: 'acl',
            key: 'acl',
            width: 70,
            render: (_, record) => {
                return (
                    <Tooltip placement="bottom" title="Add permisson">
                        <Button type="dashed" shape="circle" icon={<ToolOutlined />} onClick={() => onAcl(record)} ></Button>
                    </Tooltip>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <Space size="middle">
                    <Button type="dashed" shape="circle" onClick={() => update(record)} icon={<EditOutlined />}></Button>
                    <Popconfirm title="Xóa vai trò này?" placement="leftTop" onConfirm={() => remove(record)}>
                        <Button type="dashed" shape="circle" danger icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const onAcl = (record) => {
        setItemCP(record);
        setOpen(true);
    }

    const update = (record) => {
        navigate(`/admin/roles/detail/${record.id}`)
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
                <Breadcrumb.Item>Roles</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
                <Button type='primary' style={{ marginBottom: '16px' }}><Link to="/admin/roles/detail?action=add">Thêm vai trò</Link></Button>
                <Table
                    bordered
                    scroll={{ x: 980 }}
                    columns={columns}
                    dataSource={data}
                    rowKey='id'
                    loading={loadingTable}
                />
                <RolePermisson open={open} setOpen={setOpen} itemCP={itemCP} />

            </div>
        </>
    )
}

export default Roles