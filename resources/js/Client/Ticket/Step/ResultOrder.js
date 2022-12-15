import { Button, Card, Result } from 'antd';
import React from 'react';

const ResultOrder = ({ orderId }) => (
    <Card title="Kết quả" style={{ margin: '10px', width: '100%' }}>
        <Result
            status="success"
            title="Đặt vé thành công!"
            subTitle={`Order number: ${orderId} Cloud server configuration takes 1-5 minutes, please wait.`}
            extra={[
                <Button type="primary" key="console">
                    Trang chủ
                </Button>,
                <Button key="buy">Đặt vé khác</Button>,
            ]}
        />
    </Card>
);

export default ResultOrder;