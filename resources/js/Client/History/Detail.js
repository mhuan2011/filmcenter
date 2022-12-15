import { ArrowRightOutlined, RetweetOutlined, StopOutlined, SwapOutlined } from '@ant-design/icons';
import { Card, Col, Form, Input, Row, Spin, Button, Table, Space, Tag, Steps, Tooltip, Popconfirm, Drawer, Divider, Descriptions, Dropdown, Modal, Select, Alert } from 'antd'
import { set } from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { AppContext } from '../../Context'
import { openNotification } from '../Helper/Notification';
import helper from '../Helper/helper';
import SeatMap from './components/SeatMap';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const dateFormat = "HH:mm:ss DD/MM/YYYY"
const initialTicketInfor = {
    ticketType: [],
    reserveSeat: []
}

const { Option } = Select;
const Detail = ({ item, setOpen, open, setRefresh }) => {
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const { tranferTicket, cancleReservation, getInforReservation, getShowWithCinemaMovies, getPaymentMomo } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const [user, setUser] = useState({});
    const [show, setShow] = useState({});
    const [seat, setSeat] = useState([]);
    const [seatNumber, setSeatNumber] = useState("");
    const [modal, setModal] = useState(false);
    const [showID, setShowID] = useState("");
    const [showList, setShowList] = useState([]);

    const [ticketInfor, setTicketInfor] = useState({ initialTicketInfor });
    const [total, setTotal] = useState(0);
    const [date, setDate] = useState(null);
    const [timeList, setTimeList] = useState([]);

    useEffect(() => {
        if (item.id) {
            setLoading(true);
            setSeat([]);
            getInforReservation(item.id).then((res) => {
                if (res.data.status == true) {
                    setUser(res.data.data.user[0]);
                    setShow(res.data.data.show_infor[0]);
                    setSeat(res.data.data.seat);
                    setShowID(res.data.data.show_infor[0] ? res.data.data.show_infor[0].id : "");
                    var sn = "";
                    res.data.data.seat.map((item, index) => {
                        sn += item.row + item.number;
                        if (index < res.data.data.seat.length - 1) {
                            sn += ", "
                        }
                    })

                    setTicketInfor({
                        ticketType: [{ type: 1, quantity: res.data.data.seat.length }],
                        reserveSeat: []
                    })
                    setSeatNumber(sn);
                } else {
                    openNotification(res.data);
                    setUser({});
                    setShow({});
                    setSeat([]);
                }
                setLoading(false);

            })
        }

    }, [item])




    const onClose = () => {
        setOpen(false);
    };

    const cancleReseve = (record) => {
        cancleReservation({ resevation_id: record.id }).then((res) => {
            openNotification(res.data);
            if (res.data.code != 1) {
                // getHistoryList();
                setOpen(false);
                setRefresh(new Date());
            }
        })
    }

    const handleButtonClick = (values) => {
        if (values.key == "1") {
            //thanh toán bằng momo
            let info = { amount: seat.length * (show ? show.price : 0), orderId: item.id + '', url: window.location.href };
            setLoading(false);
            getPaymentMomo(info).then((res) => {
                window.open(res.data.url, "_self");
            })
        } else {
            //thanh toán bằng vnpay

        }
    };

    const items = [
        {
            label: 'Momo',
            key: '1',
        },
        {
            label: 'VNPay',
            key: '2',
        },
    ];
    const menuProps = {
        items,
        onClick: handleButtonClick
    };

    const getTime = (id) => {
        setDate(showList[id].date);
        setTimeList(showList[id].show);
    }

    const action = (record) => {
        let disableTranfer = false, disablePay = false, disableCancle = false;
        if (record.status == "Đã hủy") {
            disablePay = true;
            disableCancle = true;
            disableTranfer = true;
        }

        if (record.status == "Thanh toán") {
            disablePay = true;
            // disableCancle = true;
        }

        const openModel = () => {
            var formData = new FormData()
            formData.append("cinema_id", show.cinema_id ? show.cinema_id : "");
            formData.append("movie_id", show.movie_id ? show.movie_id : "");
            getShowWithCinemaMovies(formData).then((res) => {
                setShowList(res.data.data);
                if (res.data.data) {
                    var shows = res.data.data;
                    var temp = [];
                    shows.map((item, index) => {
                        temp.push({
                            value: item.id,
                            label: item.start_time
                        })
                    })
                    console.log("temo", res.data.data);
                    setShowList(res.data.data);
                }
            });
            setModal(true);
        }

        return <>
            <Space.Compact block>
                <Tooltip title="Thanh toán">
                    <Dropdown menu={menuProps} disabled={disablePay}>
                        <Button style={{ marginRight: 10 }} type="primary" disabled={disablePay}>Thanh toán</Button>
                    </Dropdown>
                </Tooltip>
                <Tooltip title="Đổi vé">
                    <Button icon={<SwapOutlined />} disabled={disableTranfer} onClick={() => openModel()} style={{ marginRight: 10 }} >Đổi vé</Button>
                </Tooltip>
                <Tooltip title="Hủy vé">
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hủy đặt vé này"}
                        onConfirm={() => cancleReseve(record)}
                        okText="Có"
                        cancelText="Không"
                        disabled={disableCancle}
                    >
                        <Button icon={<StopOutlined />} disabled={disableCancle} danger  >Trả vé</Button>
                    </Popconfirm>
                </Tooltip>
            </Space.Compact>

        </>
    }

    const changeShow = (values) => {
        setShowID(values)
    }

    const updateTicket = () => {

        var seats = [];
        ticketInfor.reserveSeat.forEach(element => {
            seats.push(element.seat.id);
        });

        let values = {
            reservation_id: item.id,
            reserveSeat: seats,
            user_id: user.id,
            is_pay: false
        }
        tranferTicket(values).then((res) => {
            if (res.data) {
                openNotification(res.data);
                setRefresh(new Date());
                setModal(false);
                setOpen(false);
            }
        });
    }

    return (
        <>
            <Drawer
                title={`Reservation ID:  ${item ? item.id : ""}`}
                placement={"right"}
                width={700}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" >
                            OK
                        </Button>
                    </Space>
                }
            >
                <Spin spinning={loading}>
                    <Divider orientation="left" orientationMargin="0">
                        Thông tin đặt vé:
                    </Divider>
                    <Descriptions
                        bordered
                        size='small'
                    >
                        <Descriptions.Item label="Phim" span={3}>{show ? show.movies_title : ""}</Descriptions.Item>
                        <Descriptions.Item label="Ngày chiếu" span={1}>{show ? show.date : ""}</Descriptions.Item>
                        <Descriptions.Item label="Suất chiếu" span={2}>{show ? show.start_time : ""}</Descriptions.Item>
                        <Descriptions.Item label="Rạp" span={3}>{show ? show.cinema_name : ""} </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={3}>
                            {show ? show.cinema_address : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghế" span={1}>
                            {seatNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thanh toán" span={1}>
                            {helper.formatCurrency(seat.length * (show ? show.price : 0))}
                        </Descriptions.Item>
                    </Descriptions>

                    <Row justify={"space-between"} style={{ paddingTop: 20 }}>
                        <Col></Col>
                        <Col>{action(item)}</Col>
                    </Row>
                </Spin>
            </Drawer>
            <Modal
                title="Đổi vé"
                centered
                open={modal}
                onOk={updateTicket}
                onCancel={() => setModal(false)}
                className="model-custom"
            >
                <Alert
                    style={{ margin: 10 }}
                    message="Lưu ý:"
                    closable
                    description="Hiện tại filmcenter chỉ cho phép đổi vé chưa thanh toán và vé đổi chị áp dụng cho suất chiếu khác cùng bộ phim, nếu quý khách muốn xem suất chiếu khác với phim và rạp khác quý khách có thể hủy vé và đặt lại vé mới. Filmcenter xin thông báo tới quý khách !!!"
                    type="info"
                />
                <Space style={{ marginLeft: 10 }}>
                    <Descriptions
                        bordered
                        size='small'
                    >
                        <Descriptions.Item label="Ngày chiếu" span={1}>{show ? show.date : ""}</Descriptions.Item>
                        <Descriptions.Item label="Suất chiếu" span={2}>{show ? show.start_time : ""}</Descriptions.Item>
                    </Descriptions>

                    <ArrowRightOutlined style={{ marginLeft: 20, marginRight: 20 }} />

                    Ngày chiếu:
                    <Select
                        showSearch
                        placeholder="Chọn ngày"
                        onChange={getTime}
                        optionFilterProp="children"
                        style={{ width: "100%", marginRight: 0 }}
                    >
                        {showList.map((item, index) => (
                            <Option value={index} key={index}>{item.date}</Option>
                        ))}
                    </Select>

                    Suất chiếu:
                    <Select
                        showSearch
                        placeholder="Chọn suất"
                        optionFilterProp="children"
                        onChange={changeShow}
                        style={{ width: "100%", marginRight: 0 }}
                    >
                        {timeList.map((item, index) => (
                            <Option value={item.id} key={index}>{moment(item.start_time, "HH:mm:ss").format("hh:mm")}</Option>
                        ))}
                    </Select>
                </Space>
                <SeatMap ticketInfor={ticketInfor} setTicketInfor={setTicketInfor} total={total} setSeat={setSeat} showID={showID} />
            </Modal>
        </>
    )
}

export default Detail