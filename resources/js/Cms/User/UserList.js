import { BarcodeOutlined, DeleteOutlined, EditOutlined, ToolOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { received } from 'laravel-mix/src/Log';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';
import ActRoleUser from './ActRoleUser';

const UserList = () => {
  let navigate = useNavigate();
  const { getListCinema, getListUser } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [open, setOpen] = useState(false);
  const [itemCP, setItemCP] = useState({});
  const [refresh, setRefresh] = useState(null)

  useEffect(() => {
    getList();
  }, [refresh])

  const getList = () => {
    setLoadingTable(true);
    getListUser().then((res) => {
      setData(res.data);
      setLoadingTable(false)
    });
  }

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
      width: 250,
      render: (_, record) => (
        <>
          {record.name} <br></br>
          <small>{"username: " + record.username}</small>
        </>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone) => {
        return (
          <>0{phone}</>
        );
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',

    },
    {
      title: 'Role',
      dataIndex: 'role_id',
      key: 'role_id',
      width: 250,

      render: (_, record) => {
        let roles = record.roles;

        let colorArr = [];
        roles.forEach(ele => {
          let role_id = ele.id
          let color = 'blue'
          if (role_id == 2) {
            color = 'volcano';
          } else if (role_id == 1) {
            color = 'gold';
          }
          colorArr.push(color);
        });

        const ren = roles.map((ele, i) => {
          return (
            <Tag color={colorArr[i]} key={i}>
              {ele.name.toUpperCase()}
            </Tag>
          )
        })
        return (
          <>{ren}</>
        );
      }
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
      width: 120,
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <Button type="dashed" shape="circle" onClick={() => update(record)} icon={<EditOutlined />}></Button>
          <Popconfirm title="Xóa tài khoản này?" placement="leftTop" onConfirm={() => remove(record)}>
            <Button type="dashed" shape="circle" danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onAcl = (record) => {
    setItemCP({ ...record });
    setOpen(true);
  }

  const update = (record) => {
    navigate(`/admin/users/detail/${record.id}`)
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
        <Breadcrumb.Item>Quản lý tài khoản</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách tài khoản</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Button type='primary' style={{ marginBottom: '16px' }}><Link to="/admin/users/detail?action=add">Thêm tài khoản</Link></Button>
        <Table
          bordered
          scroll={{ x: 980 }}
          columns={columns}
          dataSource={data}
          rowKey='id'
          loading={loadingTable}
        />
      </div>
      <ActRoleUser open={open} setOpen={setOpen} itemCP={itemCP} setRefresh={setRefresh} />
    </>
  )
}

export default UserList