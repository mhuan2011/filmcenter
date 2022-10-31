import { Card, Col, Row, Form, Input, Button, Checkbox, Spin } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { openNotification } from '../Helpers/Notification';
import { AppContext } from '../Context.js';
import { openNotification } from './Helper/Notification.js';

const Login = () => {
  const { setUser, cart_length } = useContext(AppContext);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true)
    axios.post('/api/login', values)
      .then((response) => {
        setLoading(false)
        if (response.data.status) {
          localStorage.setItem("user", JSON.stringify(response.data.data.user))
          setUser(response.data.data.user)
          if(cart_length>0){
            navigate("/my-cart")
          } else {
            navigate("/")
          }
        };
        openNotification(response.data);
      })
      .catch((error) => {
        setLoading(false)
        console.log(error);
      });
  };
  return (
    <Row>
      <Col xs={{ span: 20, offset: 2 }} lg={{ span: 8, offset: 8 }}>
        <br />
        <Card title="Login" bordered={false}>
          <Spin tip="Loading..." spinning={loading}>
            <Form
              name="normal_login"
              className="login-form"
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username / Phone number!' }]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username / Phone number" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
                <br />
                Bạn chưa có tài khoản ? <Link to="/register">Đăng kí ngay!</Link>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Col>
    </Row>
  )
}

export default Login