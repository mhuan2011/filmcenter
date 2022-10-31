import { Button, Card, Form, Input, Radio, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../Context';
const Option = Select.Option;

import { openNotification } from '../../Helper/Notification';
const OrderForm = ({ticketInfor, total}) => {
    const { user, getPaymentMomo, getPaymentVnPay, reservation } = useContext(AppContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        form.setFieldsValue({ payment_methods: 'momo', name: user.name, email: user.email, phone: user.phone })
    },[])

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

    const onFinish = (values) => {
        switch(values.payment_methods) {
            case 'momo': {
             

                var seats = [];
                ticketInfor.reserveSeat.forEach(element => {
                    seats.push(element.seat.id);
                });

                let values = {
                    reserveSeat: seats, 
                    user_id: user.id
                }
                setLoading(true);
                reservation(values).then((res) => {
                    if(res.data.status) {
                       let info = {amount: total, orderId: res.data.data.reservation_id+'', url: window.location.href};
                       setLoading(false);
                       getPaymentMomo(info).then((res) => {
                        window.open(res.data.url,"_self");
                        }) 
                    }else {
                        openNotification(res.data);
                    }
                })
                break;

            }
            case 'vnpay': {
                var seats = [];
                ticketInfor.reserveSeat.forEach(element => {
                    seats.push(element.seat.id);
                });

                let values = {
                    reserveSeat: seats, 
                    user_id: user.id
                }
                reservation(values).then((res) => {
                    if(res.data.status) {
                       let info = {amount: total, orderId: res.data.data.reservation_id+'', url: window.location.href};
                        getPaymentVnPay(info).then((res) => {
                        window.open(res.data.data,"_self");
                        }) 
                    }
                })
                
                break;
            }
            case 'zalopay': {

                break;
            }

            default:
                break;
        }
    
  };

  
  return (
    <Card title="Thông tin cá nhân" style={{margin: '10px', width: '60%'}}>
        <Form
            {...layout}
            layout='horizontal'
            form={form}
            labelAlign="left"
            onFinish={onFinish}
        >
            <Form.Item label="Phương thức thanh toán"  name='payment_methods'>
                <Select  >
                    <Option value="momo">Ví điện tử Momo</Option>
                    <Option value="vnpay">Ví điện tử VNPAY</Option>
                    <Option disabled value="zalopay">Ví điện tử Zalo Pay</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Họ và tên" name='name'   rules={[{ required: true, message: 'Nhập họ và tên!' }]}>
                <Input placeholder="Vui lòng nhập họ và tên" disabled  />
            </Form.Item>
            <Form.Item label="Số điện thoại"  name='phone'   rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
                <Input placeholder="Vui lòng nhập số điện thoại" disabled />
            </Form.Item>
            <Form.Item label="Email"  name='email'   rules={[{ required: true, message: 'Nhập email!' }]}>
                <Input placeholder="Vui lòng nhập email" disabled/>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" style={{marginRight: '10px'}} loading={loading}>
                    Xác nhận
                </Button>
            </Form.Item>

            
        </Form>
    </Card>
  );
};

export default OrderForm;