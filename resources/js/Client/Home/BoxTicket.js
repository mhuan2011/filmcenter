import { Button, Card, Carousel, Col, DatePicker, Form, Row, Select, Tabs } from 'antd';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AndroidOutlined, AppleOutlined, HomeOutlined, ScheduleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context.js';
import ByFilm from './FormTicket.js/ByFilm.js';
import ByShowDate from './FormTicket.js/ByShowDate.js';
import ByTheater from './FormTicket.js/ByTheater.js';
const { TabPane } = Tabs;

const BoxTicket = () => {

  return (
    <Card
      title="MUA VÉ NHANH"
      bordered={false}
      style={{
        width: '100%',
        height: '100%',
        
      }}
      bodyStyle = {{
        paddingTop: 0
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <VideoCameraOutlined />
              Theo Phim
            </span>
          }
          key="1"
        >
            <ByFilm/>
        </TabPane>
        <TabPane
          tab={
            <span>
              <ScheduleOutlined />
              Theo ngày
            </span>
          }
          key="2"
        >
          <ByShowDate/>
        </TabPane>
        <TabPane
          tab={
            <span>
              <HomeOutlined />
              Theo rạp
            </span>
          }
          key="3"
        >
          <ByTheater/>
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default BoxTicket