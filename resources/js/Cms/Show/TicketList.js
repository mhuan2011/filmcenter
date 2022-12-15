import { DeleteOutlined, EditOutlined, PicCenterOutlined, RollbackOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Image, Input, Popconfirm, Row, Space, Table, Tag, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import helper from '../../Client/Helper/helper';
import { AppContext } from '../../Context';
import SeatMap from './SeatMap';
import ShowDetail from './ShowDetail';

const { Search } = Input;
const TicketList = () => {
  const params = useParams();
  let navigate = useNavigate();
  const { getTicket, getListMovies } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(false);
  const [keySearch, setKeySearch] = useState("")
  const [showId, setShowId] = useState(null);

  const getlist = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const show_id = queryParams.get('show_id');
    if (show_id != null && show_id != undefined) {
      setLoadingTable(true);
      setShowId(show_id);
      getTicket({ show_id, key_search: keySearch }).then((res) => {
        setData(res.data.data);
        setLoadingTable(false);
      });
    }
  }

  useEffect(() => {
    getlist();
  }, [keySearch]);

  const onSearch = (value) => setKeySearch(value);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Số ghế',
      dataIndex: 'seat_id',
      key: 'seat_id',
      width: 100,
      render: (_, record) => {
        return (
          <>{record.row + record.number}</>
        )
      }
    },
    // {
    //   title: 'Giá',
    //   dataIndex: 'price',
    //   key: 'price',
    //   render: (price)=> {
    //     return (
    //       <>{helper.formatCurrency(price)}</>
    //     )
    //   }
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => {
        let color = status == 0 ? 'geekblue' : 'green';
        let text = status == 1 ? 'Được đặt' : 'Có sẵn';
        return (
          <Tag color={color}>
            {text.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Mã đặt vé',
      dataIndex: 'reservation_id',
      key: 'reservation_id',
      render: (reservation_id) => {
        return (
          <>{reservation_id}</>
        )
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'reservation_status',
      key: 'reservation_status',
      render: (reservation_status) => {
        return (
          <>{reservation_status}</>
        )
      }
    },
    {
      title: 'Khách hàng',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      align: 'center',
      render: (username) => {
        return (
          <>
            <Tooltip title={username}>
              <Button type="dashed" shape="circle" icon={<UserOutlined />} />
            </Tooltip>
          </>
        )
      }
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   width: 100,
    //   fixed: 'right',
    //   render: (text, record) => (
    //     <Space size="middle">
    //       <Button type="link" size="small" onClick={() => update(record)}><EditOutlined /></Button>
    //       <Popconfirm title="Xóa món này?" placement="leftTop" onConfirm={() => remove(record)}>
    //         <Button type="link" size="small" danger><DeleteOutlined /></Button>
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
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
        <Breadcrumb.Item>Quản lý lịch chiếu</Breadcrumb.Item>
        <Breadcrumb.Item>Lịch chiếu</Breadcrumb.Item>
        <Breadcrumb.Item>Lịch chiếu chi tiết</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Row justify='end'>
          <Col>
            <Button type='primary' onClick={() => navigate("/admin/show")} icon={<RollbackOutlined />}>
              Quay lại
            </Button>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={6}>
            <ShowDetail showId={showId} />
          </Col>
          <Col span={18}>
            <SeatMap showId={showId} />
          </Col>
        </Row>
        <Row style={{ paddingTop: 30, paddingBottom: 10 }}>
          <Col span={12}><Button>Print</Button></Col>
          <Col span={12}><Search placeholder="search with reservation id" onSearch={onSearch} enterButton /></Col>
        </Row>
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