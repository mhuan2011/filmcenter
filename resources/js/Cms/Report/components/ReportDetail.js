import { ArrowUpOutlined, ConsoleSqlOutlined, DeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Row, Select, Spin, Table, Tabs, Typography } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../../Client/Helper/Notification';
import { AppContext } from '../../../Context';
import helper from '../../Helper/helper';
import { Excel } from 'antd-table-saveas-excel';
import { isEmpty } from 'lodash';

const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const date = new Date();
const initialValues =
    [moment().startOf('month'), moment().endOf('month')];


let intiColumns = [
    {
        title: 'ID',
        dataIndex: 'index',
        key: 'index',
        width: 50,
    },

]
const ReportDetail = () => {
    let navigate = useNavigate();
    const { ReportDetail, getListMovies, getMovies } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [filter, setFilter] = useState({});
    const [dateRange, setDateRange] = useState(initialValues);
    const [selectedType, setSelectedType] = useState(3);
    const [moviesSelected, setMoviesSelected] = useState([]);
    const [data, setData] = useState([]);

    const [columnsCustom, setCoumnsCustom] = useState(intiColumns);

    useEffect(() => {
        getListMovies().then((res) => {
            var arr = [];
            res.data.data.forEach(element => {
                arr.push({
                    value: element.id,
                    label: element.title
                })
            });
            setMovies(arr);
        })
    }, []);

    const onChangeDate = (dates, dateStrings) => {
        setDateRange([dates[0], dates[1]]);
    };

    const onSubmit = () => {
        var values = {
            movies: moviesSelected,
            start_date: dateRange[0] ? moment(dateRange[0]).format(dateFormat) : "",
            end_date: dateRange[1] ? moment(dateRange[1]).format(dateFormat) : "",
            type: selectedType
        }
        setLoading(true);
        ReportDetail(values).then((res) => {
            if (res.data.type == 3) {
                var add_column = [];

                add_column.push(
                    {
                        title: 'Ngày',
                        dataIndex: 'date',
                        key: 'date',
                        width: 200,
                        render: (date) => {
                            var d = moment(date).format('DD-MM-y');
                            return (
                                <>{d}</>
                            )
                        }
                    }
                );
                res.data.columns_add.forEach(element => {
                    add_column.push(
                        {
                            title: element.name,
                            dataIndex: element.name,
                            key: element.name + "_" + element.id,
                            width: 50,
                            render: (_, record) => {
                                var total = 0
                                record.total.forEach(e => {
                                    if (e.movie_name == element.name) {
                                        total = e.movie_revenue;
                                    }
                                });

                                return (
                                    <>{helper.formatCurrency(total)}</>
                                )
                            }
                        },
                    )
                });
                var old = intiColumns;
                var new_coloumns = old.concat(add_column);
                console.log(new_coloumns);
                setCoumnsCustom(new_coloumns);
            }

            if (res.data.type == 4) {
                var add_column = [];

                add_column.push(
                    {
                        title: 'Tuần',
                        dataIndex: 'week',
                        key: 'week',
                        width: 200,
                        render: (week, record) => {
                            return (
                                <>{week + `( ${moment(record.start_weak).format('DD/MM/y')} - ${moment(record.end_weak).format('DD/MM/  y')})`} </>
                            )
                        }
                    }
                );
                res.data.columns_add.forEach(element => {
                    add_column.push(
                        {
                            title: element.name,
                            dataIndex: element.name,
                            key: element.name + "_" + element.id,
                            width: 50,
                            render: (_, record) => {
                                var total = 0
                                record.total.forEach(e => {
                                    if (e.movie_name == element.name) {
                                        total = e.movie_revenue;
                                    }
                                });

                                return (
                                    <>{helper.formatCurrency(total)}</>
                                )
                            }
                        },
                    )
                });
                var old = intiColumns;
                var new_coloumns = old.concat(add_column);
                console.log(new_coloumns);
                setCoumnsCustom(new_coloumns);
            }


            setData(res.data.data);
        })
            .catch()
            .finally(() => {
                setLoading(false);
            })
    }


    const exportReport = () => {
        if (!isEmpty(data)) {
            const excel = new Excel();
            excel
                .addSheet("revenue_movies")
                .addColumns(columnsCustom)
                .addDataSource(data, {
                    str2Percent: true
                })
                .saveAs(`revenue_${moment(new Date()).format(dateFormat)}.xlsx`);
        }
    }

    return (
        <>
            <Spin spinning={loading}>
                <Row gutter={16}>
                    <Col span={8}>
                        Chọn phim:
                        <Select
                            options={movies}
                            style={{ width: '100%' }}
                            mode='multiple'
                            showArrow
                            showSearch
                            onChange={setMoviesSelected}
                        />
                    </Col>
                    <Col span={8}>
                        Chọn ngày
                        <RangePicker
                            value={dateRange}
                            onChange={onChangeDate}
                            format={dateFormat}
                            allowClear={false}
                            ranges={{
                                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                'Today': [moment(), moment()],
                                'This Week': [(moment().day(1)), (moment().day(7))],
                                'This Month': [moment().startOf('month'), moment()],
                            }}
                        />
                    </Col>
                    <Col span={4}>
                        Loại thống kê
                        <Select
                            defaultValue={3}
                            options={
                                [
                                    // {
                                    //     value: 1,
                                    //     label: 'Doanh thu theo rạp'
                                    // },
                                    // {
                                    //     value: 2,
                                    //     label: 'Doanh thu theo suất chiếu'
                                    // },
                                    {
                                        value: 3,
                                        label: 'Doanh thu theo ngày'
                                    },
                                    {
                                        value: 4,
                                        label: 'Doanh thu theo tuần'
                                    },

                                ]
                            }
                            style={{ width: '100%' }}
                            showArrow
                            onChange={setSelectedType}
                        />
                    </Col>
                </Row>
                <Row style={{ marginTop: 14, marginBottom: 14 }}>
                    <Button type='primary' onClick={onSubmit}
                        style={{ marginRight: 10 }}
                    >Xuất báo cáo</Button>
                    <Button
                        onClick={exportReport}
                        type='dashed'
                        icon={<FileExcelOutlined
                        />}>Export excel</Button>
                </Row>
                <Table
                    columns={columnsCustom}
                    dataSource={data}
                    rowKey={'id'}
                />

            </Spin>
        </>
    )
}

export default ReportDetail