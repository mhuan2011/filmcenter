import { BarcodeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import { AppContext } from '../../Context'; 

const Show = () => {
  let navigate = useNavigate();
  const { getListShow, deleteShow } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [categories, setCategories] = useState([])
  useEffect(() => {
    getListShow ().then((res) => {
      setData(res.data.data);
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
      title: 'Ngày chiếu',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
        title: 'Thời gian kết thúc',
        dataIndex: 'end_time',
        key: 'end_time',
    },
    {
        title: 'Phim',
        dataIndex: 'movie_id',
        key: 'movie_id',
        render: (_, record) =>  (
          <>{record.movies.title}</>
        )
    },
    {
        title: 'Rạp',
        dataIndex: 'cinema_hall_id',
        key: 'cinema_hall_id',
        render: (_, record) => (
          <>{record.cinema_hall.name}</>
        )
    },
    {
      title: 'Ticket list',
      key: 'ticket',
      width: 100,
      fixed: 'right',
      render: (text, record) => (
        <Link to={'/admin/show/ticket?show_id='+record.id}> <BarcodeOutlined /> Details</Link>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => update(record)}><EditOutlined /></Button>
          <Popconfirm title="Xóa rạp này?" placement="leftTop" onConfirm={() => remove(record)}>
            <Button type="link" size="small" danger><DeleteOutlined /></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const update = (record) => {
    navigate(`/admin/show/detail/${record.id}`)
  }
  const remove = (record) => {
    setLoadingTable(true)
    deleteShow(record.id).then((res) => {
      let newItems = data.filter(item => item.id !== record.id)
      setData(newItems)
      openNotification(res.data);
      setLoadingTable(false)
    })
  }
  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý rạp</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách rạp</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Button type='primary' style={{ marginBottom: '16px' }}><Link to="/admin/show/detail?action=add">Thêm lịch chiếu</Link></Button>
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

export default Show