import { BarcodeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import { AppContext } from '../../Context'; 

const UserList = () => {
  let navigate = useNavigate();
  const { getListCinema, getListUser } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [categories, setCategories] = useState([])
  useEffect(() => {
    setLoadingTable(true);
    getListUser().then((res) => {
        setData(res.data);
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
      width: 250,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 250,
      render: (username) => {
        return (
          <strong>{username}</strong>
        );
    }
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
        width: 150,
        render: (role_id) => {
            let color = 'blue'
            if(role_id == 1) {
                color  =  'volcano';
            }else if( role_id == 2){
                color  =  'gold';
            }


            let text = "Khách hàng";
            if(role_id == 1 ) text = "Nhân viên"
            else if(role_id == 2) text = "Quản lý";
            return (
            <Tag color={color}>
                {text.toUpperCase()}
            </Tag>
            );
        }
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
    </>
  )
}

export default UserList