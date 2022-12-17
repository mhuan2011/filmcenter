import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tabs, Typography } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';
import ReportCinema from './components/ReportCinema';
import ReportFilm from './components/ReportFilm';
const { Paragraph, Text } = Typography;
const Report = () => {
    let navigate = useNavigate();
    const { getFilterCategory } = useContext(AppContext);
    return (
        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Báo cáo</Breadcrumb.Item>
                <Breadcrumb.Item>Báo cáo chi tiết</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            label: 'Thống kê doanh thu phim',
                            key: '1',
                            children: <ReportFilm />,
                        },
                        {
                            label: 'Thống kê doanh thu rạp',
                            key: '2',
                            children: <ReportCinema />,
                        },
                        {
                            label: 'Tổng doanh thu',
                            key: '3',
                            children: 'Tab 3',
                        },
                    ]}
                />
            </div>
        </>
    )
}

export default Report