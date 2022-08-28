import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import { AppContext } from '../../Context'; 

const CinemaHall = () => {
  let navigate = useNavigate();
  const { getFilterCategory, getListCinemalHall, deleteCinemalHall } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [categories, setCategories] = useState([])
  useEffect(() => {
    getFilterCategory().then((res) => {
      setCategories(res.data.data);
      console.log(res.data.data)
    });
    getListCinemalHall ().then((res) => {
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
      title: 'Tên rạp',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    
    {
      title: 'Số ghế',
      dataIndex: 'total_seat',
      key: 'total_seat',
      width: 100,
    },
    {
      title: 'Rạp',
      dataIndex: 'cinema',
      key: 'cinema',
      render: (_, record) => (
        <>{record.cinema.name}</>
      )
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
    navigate(`/admin/cinema-hall/detail/${record.id}`)
  }
  const remove = (record) => {
    setLoadingTable(true)
    deleteCinemalHall(record.id).then((res) => {
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
        <Button type='primary' style={{ marginBottom: '16px' }}><Link to="/admin/cinema-hall/detail?action=add">Thêm rạp</Link></Button>
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

export default CinemaHall