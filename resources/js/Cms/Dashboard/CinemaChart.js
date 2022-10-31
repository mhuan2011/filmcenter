import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment';
import { Row, Col, Card, DatePicker, Select, Spin } from 'antd';
import { AppContext } from '../../Context'; 
import Highcharts from 'highcharts'
// import HighchartsReact from 'highcharts-react-official'

import Chart from "react-apexcharts";

const { RangePicker } = DatePicker;


const dateFormat = 'YYYY-MM-DD';
const initchartData = {
    options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        },
        title: {
        text: 'Tổng số phòng chiếu theo rạp',
        align: 'left'
        },
        chart: {
            height: 350,
            type: 'bar',
            zoom: {
                enabled: false
            }
        },
      },
    series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    
};
const CinemaChart = (dataDate) => {
  const { user, cinemaHallOfCinema, revenueByDate} = useContext(AppContext);
  const [data, setData] = useState({
    time_start: '2022-08-01',
    time_end: '2022-08-31',
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
  }, [])

  useEffect(() => {
      if(data) {
       
        cinemaHallOfCinema().then((res) => {
            setRawData(res.data.data);
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
        arr.push(parseInt(i.number_cinema_hall))
        arrData.push(i.name)
      })
    }
    let series = [{
      name: "Tổng số phòng chiếu theo rạp",
      data: arr,
    }]
    let options = {
      chart: {
        height: 350,
        type: 'bar',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: 'Tổng số phòng chiếu theo rạp',
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
        <Chart options={chartData.options} series={chartData.series}  type="bar"  height={350} width={800}/>
    </>
  )
}

export default CinemaChart