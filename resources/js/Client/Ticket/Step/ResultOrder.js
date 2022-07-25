import { Button, Card, Result } from 'antd';
import React from 'react';

const ResultOrder = () => (
    <Card title="Kết quả" style={{margin: '10px', width: '100%'}}>
        <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
            <Button type="primary" key="console">
                Go Console
            </Button>,
            <Button key="buy">Đặt vé khác</Button>,
            ]}
        />
   </Card>
);

export default ResultOrder;