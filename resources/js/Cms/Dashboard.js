import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment';
import { Row, Col, Card, DatePicker, Select, Spin } from 'antd';
import { AppContext } from '../Context';
import Highcharts from 'highcharts'
// import HighchartsReact from 'highcharts-react-official'

import Chart from "react-apexcharts";
import CinemaChart from './Dashboard/CinemaChart';

const { RangePicker } = DatePicker;
const date = new Date();

const dateFormat = 'YYYY-MM-DD';
const initchartData = {
  series: [{
    name: "Desktops",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }],
  options: {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'Bảng doanh thu theo ngày',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    stroke: {
      curve: 'smooth',
    }
  },
};

const Dashboard = () => {
  const { user, statisticByDate, revenueByDate } = useContext(AppContext);
  const [data, setData] = useState({
    time_start: moment(new Date(date.getFullYear(), date.getMonth(), 1), dateFormat),
    time_end: moment(new Date(date.getFullYear(), date.getMonth() + 1, 0), dateFormat),
    store_id: user ? user.store_id : 0,
  });

  const [statistic, setStatistic] = useState({
    amount: 0,
    cinema: 0,
    movies: 0,
    users: 0
  });


  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState();
  const [revenue, setRevenue] = useState();
  const [totalOrder, setTotalOrder] = useState();
  const [employee, setEmployee] = useState();
  const [totalBooking, setTotalBooking] = useState();
  const [rawData, setRawData] = useState();
  const [chartData, setChartData] = useState(initchartData);



  useEffect(() => {
    if (data) {
      setLoading(true);
      statisticByDate(data).then((res) => {
        setStatistic(res.data.data);

      })
      revenueByDate(data).then((res) => {
        setRawData(res.data.data);
        setLoading(false);
      })

    }

  }, [data])

  const onChangeDate = (dates, dateStrings) => {
    setData({ ...data, time_start: dateStrings[0], time_end: dateStrings[1] });
  };

  useEffect(() => {
    let arr = [];
    let arrData = [];
    if (rawData) {
      rawData.map((i) => {
        arr.push(parseInt(i.amount))
        arrData.push(i.created_at.slice(0, 10))
      })
    }
    let series = [{
      name: "Tổng tiền",
      data: arr,
    }]
    let options = {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Bảng doanh thu theo ngày',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: arrData,
      },
      stroke: {
        curve: 'smooth',
      }
    }
    setChartData({ ...chartData, series, options })
  }, [rawData])

  return (
    <>
      <Row justify='space-between'>
        <Col>
          {user.role_id == 1 ?
            <Select
              optionFilterProp="children"
              style={{ width: '200px' }}
              defaultValue={0}
            >
              <Select.Option key="0" value={0}>Tất cả các rạp</Select.Option>
              {/* {stores && stores.map((item) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)} */}
            </Select>
            : null}
        </Col>
        <Col span={8}>
          <RangePicker
            defaultValue={[moment(new Date(date.getFullYear(), date.getMonth(), 1), dateFormat), moment(new Date(date.getFullYear(), date.getMonth() + 1, 0), dateFormat)]}
            onChange={onChangeDate}
            format={dateFormat}
            allowClear={false}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '12px' }}>
        <Col className="gutter-row" span={6}>
          <Spin spinning={loading}>
            <Card title="Doanh thu" style={{ textAlign: "center" }}>
              {statistic.amount ? `${statistic.amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0} VND
            </Card>
          </Spin>
        </Col>
        <Col className="gutter-row" span={6}>
          <Spin spinning={loading}>
            <Card title="Tổng số phim" style={{ textAlign: "center" }}>
              {statistic.movies}
            </Card>
          </Spin>

        </Col>
        <Col className="gutter-row" span={6}>
          <Spin spinning={loading}>
            <Card title="Tổng số rạp" style={{ textAlign: "center" }}>
              {statistic.cinema}
            </Card>
          </Spin>
        </Col>
        <Col className="gutter-row" span={6}>
          <Spin spinning={loading}>
            <Card title="Số lượng nhân viên" style={{ textAlign: "center" }}>
              {statistic.users}
            </Card>
          </Spin>
        </Col>
      </Row>
      <Row style={{ marginTop: '12px' }}>
        <Col span={12}>
          <Chart options={chartData.options} series={chartData.series} type="line" height={350} />
        </Col>
        <Col span={12}>
          <CinemaChart dataDate={data} />
        </Col>
      </Row>
    </>
  )
}

export default Dashboard