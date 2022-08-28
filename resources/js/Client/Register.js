import { Button, Card, Col, Form, Input, Row, Spin } from 'antd'
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from './Helper/Notification'; 

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Register = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    if(values.password !== values.repassword){
      openNotification({status: false, message: 'Mật khẩu không khớp!' })
      return;
    }
    setLoading(true)
    axios.post('/api/register', values)
      .then((response) => {
        setLoading(false)
        if (response.data.status) navigate("/login");
        openNotification(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Row>
      <Col xs={{ span: 20, offset: 2 }} lg={{ span: 12, offset: 6 }}>
        <br />
        <Card title="Register" bordered={false}>
          <Spin tip="Loading..." spinning={loading}>
            <Form
              {...layout}
              labelAlign="left"
              layout='horizontal'
              onFinish={onFinish}
            >
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Nhập lại mật khẩu"
                name="repassword"
                rules={[{ required: true, message: 'Please input your password again!' }]}
              >
                <Input.Password/>
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Đăng ký
                </Button>
                <br />
                Bạn đã có tài khoản ? <Link to="/login">Đăng nhập ngay!</Link>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Col>
    </Row>
  )
}

export default Register