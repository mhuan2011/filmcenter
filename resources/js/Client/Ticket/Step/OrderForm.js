import { Button, Card, Form, Input, Radio, Select } from 'antd';
import React, { useState } from 'react';

const OrderForm = () => {
  const [form] = Form.useForm();

  const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16
    },
  };

  
  return (
    <Card title="Thông tin cá nhân" style={{margin: '10px', width: '60%'}}>
        <Form
            {...layout}
            layout='horizontal'
            form={form}
            labelAlign="left"
        >
            <Form.Item label="Phương thức thanh toán">
                <Select defaultValue="momo" >
                    <Option value="momo">Ví điện tử Momo</Option>
                    <Option value="vnpay">Ví điện tử VNPAY</Option>
                    <Option value="zalopay">Ví điện tử Zalo Pay</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Họ và tên">
                <Input placeholder="Vui lòng nhập họ và tên" />
            </Form.Item>
            <Form.Item label="Số điện thoại">
                <Input placeholder="Vui lòng nhập số điện thoại" />
            </Form.Item>
            <Form.Item label="Email">
                <Input placeholder="Vui lòng nhập email" />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>
                    Xác nhận
                </Button>
                <Button htmlType="button" >
                    Quay lại
                </Button>
            </Form.Item>

            
        </Form>
    </Card>
  );
};

export default OrderForm;