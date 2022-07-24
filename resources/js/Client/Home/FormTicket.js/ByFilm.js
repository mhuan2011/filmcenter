import { Button, Card, Carousel, Col, DatePicker, Form, Row, Select, Tabs } from 'antd';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AndroidOutlined, AppleOutlined, HomeOutlined, ScheduleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { AppContext } from '../../../Context.js';
const { TabPane } = Tabs;

const {Option} = Select;
const ByFilm = () => {

  return (
    <Form
      name="basic"
      labelCol={{
        span: 16,
      }}
      wrapperCol={{
        span: 24,
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <Form.Item
        name="film"
        rules={[
          {
            required: true,
            message: 'Chọn phim!',
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn phim"
          optionFilterProp="children"
          style={{ width: "100%", marginRight: 0 }}
        >
          <Option value="jack">Cảnh Sát Vũ Trụ - Lightyear (2022)</Option>
          <Option value="lucy">Điện Thoại Đen - The Black Phone (2022)</Option>
          <Option value="tom">Phù Thủy Tối Thượng Trong Đa Vũ Trụ Hỗn Loạn - Doctor Strange in the Multiverse of Madness (2022)</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="theater"
        rules={[
          {
            required: true,
            message: 'Chọn rạp!',
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn rạp"
          optionFilterProp="children"
          style={{ width: "100%", marginRight: 0 }}
        >
          <Option value="jack">GigaMall HCM</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="date_show"
        rules={[
          {
            required: true,
            message: 'Chọn ngày!',
          },
        ]}
        style={{ width: "100%", marginRight: 0 }}
      >
        <Select
          showSearch
          placeholder="Chọn ngày"
          optionFilterProp="children"
          style={{ width: "100%", marginRight: 0 }}
        >
          <Option value="jack">Thứ 2 (18/7/2022)</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="show_time"
        rules={[
          {
            required: true,
            message: 'Chọn suất!',
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn suất"
          optionFilterProp="children"
          style={{ width: "100%", marginRight: 0 }}
        >
          <Option value="jack">12:30h (Phụ đề)</Option>
        </Select>
      </Form.Item>
      <Form.Item >
        <Row>
          <Col
            span={24}
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary">Mua vé</Button>
          </Col>
        </Row>
        
      </Form.Item>
    </Form>
  )
}

export default ByFilm