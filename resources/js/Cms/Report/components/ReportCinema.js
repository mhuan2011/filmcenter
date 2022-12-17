import { ArrowUpOutlined, DeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Descriptions, Form, Image, Popconfirm, Progress, Row, Select, Space, Spin, Statistic, Table, Tabs, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import helper from '../../Helper/helper';
import { AppContext } from '../../../Context';
import { isEmpty } from 'lodash';
import { Excel } from 'antd-table-saveas-excel';

const date = new Date();
const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;

const initialDate = [
    moment(new Date(date.getFullYear(), date.getMonth(), 1), dateFormat),
    moment(new Date(date.getFullYear(), date.getMonth() + 1, 0), dateFormat)
]
const ReportCinema = () => {
    let navigate = useNavigate();
    const { getReportCinema, getListCinema } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        time_start: moment(new Date(date.getFullYear(), date.getMonth(), 1), dateFormat),
        time_end: moment(new Date(date.getFullYear(), date.getMonth() + 1, 0), dateFormat),
    });
    const [dateSelected, setDateSelected] = useState(initialDate);
    const [dataSource, setDataSource] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [cinemasSelected, setCinemasSelected] = useState([]);

    useEffect(() => {
        getListCinema().then(res => {
            var data = helper.formatSelect(res.data.data)
            console.log(data);
            setCinemas(data);
        })
    }, [])

    useEffect(() => {
        if (data) {
            setLoading(true);
            var values = data;
            if (!isEmpty(cinemasSelected)) {
                values.cinemas = cinemasSelected;
            }
            getReportCinema(values).then(res => {
                setDataSource(res.data);
                setLoading(false);
            })
        }
    }, [dateSelected, cinemasSelected]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Tên rạp',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Doanh thu',
            dataIndex: 'total',
            key: 'total',
            width: 300,
            render: (total) => (
                <>{helper.formatCurrency(total)}</>
            )
        },


    ];

    const onChangeDate = (dates, dateStrings) => {
        setData({ time_start: dateStrings[0], time_end: dateStrings[1] });
        setDateSelected([moment(dateStrings[0], dateFormat), moment(dateStrings[1], dateFormat)])
    };

    const getThisMonth = () => {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setData({ time_start: firstDay, time_end: lastDay })
        setDateSelected([moment(firstDay, dateFormat), moment(lastDay, dateFormat)]);
    }

    const getThisWeek = () => {
        setData({ time_start: moment().day(1), time_end: moment().day(7) })
        setDateSelected([(moment().day(1)), (moment().day(7))]);
    }

    const getToday = () => {
        setData({ time_start: moment(), time_end: moment() })
        setDateSelected([moment(), moment()]);
    }

    const footerPicker = () => {
        return (
            <>
                <Tag className='click-tag' color="geekblue" onClick={getThisMonth}>This month</Tag>
                <Tag className='click-tag' color="geekblue" onClick={getThisWeek}>This week</Tag>
                <Tag className='click-tag' color="geekblue" onClick={getToday}>Today</Tag>
            </>
        )
    }

    const selectCinema = (values) => {
        console.log(values);
        setCinemasSelected(values);
    }

    const exportReport = () => {
        if (!isEmpty(dataSource)) {
            const excel = new Excel();
            excel
                .addSheet("revenue_of_cinema")
                .addColumns(columns)
                .addDataSource(dataSource, {
                    str2Percent: true
                })
                .saveAs(`revenue_cinema_${moment(dateSelected[0]).format(dateFormat)}_${moment(dateSelected[1]).format(dateFormat)}.xlsx`);
        }
    }

    return (
        <>
            <Spin spinning={loading}>
                <Card
                    title="Doanh thu"
                    extra={
                        <>
                            <RangePicker
                                value={dateSelected}
                                onChange={onChangeDate}
                                format={dateFormat}
                                allowClear={false}
                                renderExtraFooter={footerPicker}
                            />
                        </>
                    }
                >
                    <Row style={{ marginBottom: 20 }}>
                        <Col span={12}>
                            Chọn rạp chiếu:
                            <Select
                                style={{ width: '100%' }}
                                options={cinemas} onChange={selectCinema}
                                allowClear
                                mode="multiple"
                            />
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        bordered={true}
                        rowKey={'id'}

                    />

                    <Button onClick={exportReport} type='primary' icon={<FileExcelOutlined />}>Export excel</Button>

                </Card>
            </Spin >
        </>
    )
}

export default ReportCinema