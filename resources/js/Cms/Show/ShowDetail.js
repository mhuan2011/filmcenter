import { Affix, Avatar, Button, Card, Col, Divider, InputNumber, Row, Popover, Spin, Table, Tag, Descriptions, Progress } from 'antd'
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context.js';
import helper from '../../Client/Helper/helper.js';
import { useParams } from 'react-router';

const ShowDetail = ({ showId }) => {
  const { getShow } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showId) {
      setLoading(true);
      getShow(showId).then((res) => {
        if (res.data.status) {
          setData(res.data.data);
          setLoading(false);
        }
      })
    }
  }, [showId]);


  return (
    <Card style={{ height: '100%', marginTop: '20px' }} title={"Lịch chiếu chi tiết"}>
      <Spin spinning={loading}>
        <Descriptions title="Thông tin">
          <Descriptions.Item label="Ngày chiếu" span={3}>{data.date}</Descriptions.Item>
          <Descriptions.Item label="Thời gian bắt đầu" span={3}>{data.start_time}</Descriptions.Item>
          <Descriptions.Item label="Phim" span={3}>{data.movies ? data.movies.title : ""}</Descriptions.Item>
          <Descriptions.Item label="Rạp" span={3}>{data.cinema_hall ? data.cinema_hall.name : ""}</Descriptions.Item>
        </Descriptions>

        <Descriptions title="Thống kê">
          <Descriptions.Item label="Đã bán" span={3}><Progress percent={50} status="active" /></Descriptions.Item>
        </Descriptions>
      </Spin>
    </Card>



  )
}

export default ShowDetail