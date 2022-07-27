import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment';
import { Row, Col, Card, DatePicker, Select } from 'antd';
import { AppContext } from '../Context'; 
import Chart from "react-apexcharts";
const { RangePicker } = DatePicker;
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
    }
  },
};
const Dashboard = () => {
  const { user} = useContext(AppContext);
  const [data, setData] = useState({
    time_start: '2022-05-01',
    time_end: '2022-05-31',
    store_id: user ? user.store_id : 0,
  });
  const [stores, setStores] = useState();
  const [revenue, setRevenue] = useState();
  const [totalOrder, setTotalOrder] = useState();
  const [employee, setEmployee] = useState();
  const [totalBooking, setTotalBooking] = useState();
  const [rawData, setRawData] = useState();
  const [chartData, setChartData] = useState(initchartData);

  useEffect(() => {
  }, [])

  useEffect(() => {
   
  }, [data])

  useEffect(() => {
    
  }, [rawData])



  return (
    <>
      <Row justify='space-between'>
        <Col>
        {user.role_id == 1 ?
          <Select
            optionFilterProp="children"
            style={{ width: '200px'}}
            defaultValue={0}
          >
            <Select.Option key="0" value={0}>Tất cả các rạp</Select.Option>
            {/* {stores && stores.map((item) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)} */}
          </Select>
          : null}
        </Col>
        <Col span={8}>
          <RangePicker
            defaultValue={[moment('2022-05-01', dateFormat), moment('2022-05-31', dateFormat)]}
            format={dateFormat}
            allowClear={false}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '12px' }}>
        <Col className="gutter-row" span={6}>
          <Card title="Doanh thu" style={{ textAlign: "center" }}>
            {`${100000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card title="Tổng số phim" style={{ textAlign: "center" }}>
            {totalOrder}
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card title="Tổng số rạp" style={{ textAlign: "center" }}>
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          <Card title="Số lượng nhân viên" style={{ textAlign: "center" }}>
          </Card>
        </Col>
      </Row>

      {/* <Chart options={chartData.options} series={chartData.series} type="line" height={350} /> */}
    </>
  )
}

export default Dashboard