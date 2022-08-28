import { Card, Col, Form, Input, Row, Spin, Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { AppContext } from '../../Context' 
import { openNotification } from '../Helper/Notification';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
const User = () => {
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const { user, updateUserInfor } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue(user)
    },[])

    const onFinish = (values) => {
        // if(values.password !== values.repassword){
        //   openNotification({status: false, message: 'Mật khẩu không khớp!' })
        //   return;
        // }
        setLoading(true)
        values.id = user.id;
        updateUserInfor(values)
          .then((response) => {
            setLoading(false)
            openNotification(response.data);
            navigate("/logout");
          })
          .catch((error) => {
            console.log(error);
          });
      };
  return (
    <div className="me">
        <Row>
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                <br />
                <Card bordered={false} title='THÔNG TIN CÁ NHÂN' >
                    <Spin tip="Đang tải..." spinning={loading}>
                        <Row justify='center'>
                            <Col span={8}>
                            <Form
                                {...layout}
                                form={form}
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
                                    Lưu 
                                    </Button>
                                </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Spin>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default User