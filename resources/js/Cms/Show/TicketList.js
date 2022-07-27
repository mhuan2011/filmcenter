import { DeleteOutlined, EditOutlined, RollbackOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Image, Popconfirm, Row, Space, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import helper from '../../Client/Helper/helper';
import { AppContext } from '../../Context'; 
import SeatMap from './SeatMap';

const TicketList = () => {
  const params = useParams();
  let navigate = useNavigate();
  const { getTicket, getListMovies } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [categories, setCategories] = useState([])
  const [showId, setShowId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const show_id = queryParams.get('show_id');

    if(show_id != null && show_id != undefined) {
      setShowId(show_id);
      getTicket(show_id).then((res) => {
        setData(res.data.data);
        setLoadingTable(false)
      });
    }
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Số ghế',
      dataIndex: 'seat_id',
      key: 'seat_id',
      render: (_, record) => {
        return (
          <>{record.seat.row+record.seat.number}</>
        )
      }
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price)=> {
        return (
          <>{helper.formatCurrency(price)}</>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
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
    navigate(`/admin/movies/detail/${record.id}`)
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
        <Row justify='end'>
          <Col>
            <Button type='primary' onClick={() => navigate("/admin/show")} icon={<RollbackOutlined />}>
              Quay lại
            </Button>
          </Col>
        </Row>
        <SeatMap showId={showId}/>
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

export default TicketList