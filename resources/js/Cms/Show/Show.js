import { BarcodeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, DatePicker, Image, Input, Popconfirm, Row, Space, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';


const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const date = new Date();

const { Search } = Input;
const initialValues =
  [(moment().day(1)), (moment().day(7))];

const Show = () => {
  let navigate = useNavigate();
  const { getListShow, deleteShow, getListCinemalHallActive } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [filter, setFilter] = useState({});
  const [dateRange, setDateRange] = useState(initialValues);
  const [cinemaHall, setCinameHall] = useState([]);
  const [keySearch, setKeySearch] = useState("");

  useEffect(() => {
    getListCinemalHallActive().then(res => {
      var p = [];
      res.data.data.forEach(element => {
        p.push({
          text: element.name,
          value: element.id,
        })
      });
      setCinameHall(p);
    })
  }, [])

  useEffect(() => {
    var values = {};
    if (dateRange) {
      values.start_date = moment(dateRange[0]).format(dateFormat);
      values.end_date = moment(dateRange[1]).format(dateFormat);
    }
    if (keySearch) values.key_search = keySearch;
    setLoadingTable(true);
    getListShow({ ...values, ...filter }).then((res) => {
      setData(res.data.data);
      setLoadingTable(false)
    });
  }, [dateRange, keySearch])



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
      render: (_, record) => (
        <>{record.movies.title}</>
      )
    },
    {
      title: 'Rạp',
      dataIndex: 'cinema_hall_id',
      key: 'cinema_hall_id',
      filters: cinemaHall,
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
        <Link to={'/admin/show/ticket?show_id=' + record.id}> <BarcodeOutlined /> Chi tiết</Link>
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

  const getThisMonth = () => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setDateRange([moment(firstDay, dateFormat), moment(lastDay, dateFormat)]);
  }


  const handleTableChange = (pagination, filters, sorter) => {
    setFilter(filters);
    getListShows(filters);
  };

  const onChangeDate = (dates, dateStrings) => {
    setDateRange([dates[0], dates[1]]);
  };

  const getListShows = (filters) => {
    var values = {};
    if (dateRange) {
      values.start_date = moment(dateRange[0]).format(dateFormat);
      values.end_date = moment(dateRange[1]).format(dateFormat);
    }

    if (keySearch) values.key_search = keySearch;
    setLoadingTable(true);
    getListShow({ ...values, ...filters }).then((res) => {
      setData(res.data.data);
      setLoadingTable(false)
    });
  }


  const onSearch = (value) => setKeySearch(value);
  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý rạp</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách rạp</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Row gutter={8}>
          <Col span={8}><Button type='primary' style={{ marginBottom: '16px' }}><Link to="/admin/show/detail?action=add">Thêm lịch chiếu</Link></Button></Col>

          <Col span={8}>
            <RangePicker
              value={dateRange}
              onChange={onChangeDate}
              format={dateFormat}
              allowClear={false}
              // renderExtraFooter={footerPicker}
              ranges={{
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Today': [moment(), moment()],
                'This Week': [(moment().day(1)), (moment().day(7))],
                'This Month': [moment().startOf('month'), moment()],
              }}
            />
          </Col>
          <Col span={8}><Search placeholder="Tìm kiếm với mã đặt vé" onSearch={onSearch} enterButton /></Col>
        </Row>

        <Table
          bordered
          scroll={{ x: 980 }}
          columns={columns}
          dataSource={data}
          rowKey='id'
          loading={loadingTable}
          onChange={handleTableChange}
        />
      </div>
    </>
  )
}

export default Show