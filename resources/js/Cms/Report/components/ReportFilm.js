import { ArrowUpOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Descriptions, Form, Image, Popconfirm, Progress, Row, Select, Space, Spin, Statistic, Table, Tabs, Typography } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../../Client/Helper/Notification';
import { AppContext } from '../../../Context';
const { Paragraph, Text } = Typography;
const ReportFilm = () => {
    let navigate = useNavigate();
    const { getReportByFilm, getListMovies, getMovies } = useContext(AppContext);
    const [movies, setMovies] = useState([]);
    const [movieId, setMovieId] = useState("");

    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalShow, setTotalShow] = useState(0);
    const [movie, setMovie] = useState({});
    const [rate, setRate] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getListMovies().then((res) => {
            var m = [];
            res.data.data.map(item => {
                m.push({
                    label: item.title,
                    value: item.id
                })
            })
            setMovies(m);
        })
    }, [])

    useEffect(() => {
        if (movieId) {

            getReport(movieId);
            getMovies(movieId).then(res => {
                setMovie(res.data.data)
            })
        }
    }, [movieId])

    const getReport = (movie_id) => {
        setLoading(true);
        getReportByFilm({ movie_id }).then(res => {
            setTotalRevenue(res.data.total_revenue);
            setTotalShow(res.data.show);

            var r = (res.data.rate.book / res.data.rate.total) * 100;
            setRate(r.toFixed(2));
            setLoading(false);
        })
    }

    const selectMovie = (values) => {
        setMovieId(values);
    }

    const getImage = () => {
        var image = movie.image ? movie.image : "/default.webp";
        var url = APP_URL + '/images/movies' + image;
        return url;
    }

    return (
        <>
            <Spin spinning={loading}>
                <Row>
                    <Col span={8}>
                        <Form>
                            <Form.Item
                                label="Phim"
                            >
                                <Select
                                    options={movies} onChange={selectMovie} allowClear
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col>
                        <Button onClick={getReport}></Button>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card
                            title={'Thông tin phim'}
                        >
                            <Descriptions
                                bordered
                                size='small'
                            >
                                <Descriptions.Item label="Tên" span={3}>{movie ? movie.title : ""}</Descriptions.Item>
                                <Descriptions.Item label="Hình ảnh" span={3}>
                                    <Image src={getImage()} />
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Row gutter={16} style={{ width: '100%' }}>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Tổng doanh thu"
                                        value={totalRevenue}
                                        precision={0}
                                        valueStyle={{
                                            color: '#3f8600',
                                        }}
                                        // prefix={<ArrowUpOutlined />}
                                        suffix="VND"
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Số suất chiếu"
                                        value={totalShow}
                                        precision={0}
                                        valueStyle={{
                                            color: '#3f8600',
                                        }}
                                        // prefix={<ArrowUpOutlined />}
                                        suffix="Suất"
                                    />
                                </Card>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '20px' }} gutter={32}>
                            <Col span={12}>
                                <Card title="Tỉ lệ mua vé" bodyStyle={{ textAlign: 'center' }}>
                                    <Progress
                                        type="circle"
                                        style={{ fontSize: 35, width: 200 }}
                                        percent={rate}
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Spin>
        </>
    )
}

export default ReportFilm