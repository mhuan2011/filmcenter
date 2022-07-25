import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import { AppContext } from '../../Context'; 

const MoviesList = () => {
  let navigate = useNavigate();
  const {deleteMenu } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  useEffect(() => {
    setLoadingTable(false)
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
        title: 'Ảnh',
        dataIndex: 'pic',
        key: 'pic',
        width: 130,
        render: pic => {
          return (
            <Image
              width={40}
              height={40}
              preview={false}
              src={APP_URL + '/images' + pic}
            />
          )
        }
      },
    {
      title: 'Tên phim',
      dataIndex: 'name',
      key: 'name',
    },
    {
        title: 'Danh mục',
        key: 'category',
        dataIndex: 'category',
        width: 120,
        filters: [
          {
            text: 'Món Khai Vị',
            value: 1,
          },
          {
            text: 'Món Chính',
            value: 2,
          },
          {
            text: 'Món Đặc Biệt',
            value: 3,
          },
          {
            text: 'Nước giải khát',
            value: 4,
          },
        ],
        onFilter: (value, record) => record.category == value,
        render: (value, record) => {
          if (record.category === 1) return <Tag color="purple">Món Khai Vị</Tag>
          if (record.category === 2) return <Tag color="green">Món Chính</Tag>
          if (record.category === 3) return <Tag color="yellow">Món Đặc Biệt</Tag>
          if (record.category === 4) return <Tag color="pink">Nước giải khát</Tag>
        }
      },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    
    
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => update(record)}><EditOutlined /></Button>
          <Popconfirm title="Xóa món này?" placement="leftTop" onConfirm={() => remove(record)}>
            <Button type="link" size="small" danger><DeleteOutlined /></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const update = (record) => {
    navigate(`/admin/menus/detail/${record.id}`)
  }
  const remove = (record) => {
    setLoadingTable(true)
    deleteMenu(record.id).then((res) => {
      let newItems = data.filter(item => item.id !== record.id)
      setData(newItems)
      openNotification(res.data);
      setLoadingTable(false)
    })
  }
  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý phim</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Button type='primary' style={{ marginBottom: '16px' }}><Link to="/admin/menus/detail">Thêm phim</Link></Button>
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

export default MoviesList