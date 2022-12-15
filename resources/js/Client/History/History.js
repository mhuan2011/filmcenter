import { RetweetOutlined, StopOutlined, SwapOutlined } from '@ant-design/icons';
import { Card, Col, Form, Input, Row, Spin, Button, Table, Space, Tag, Steps, Tooltip, Popconfirm, Dropdown } from 'antd'
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { AppContext } from '../../Context'
import { openNotification } from '../Helper/Notification';
import Detail from './Detail';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const dateFormat = "HH:mm:ss DD/MM/YYYY"

const History = () => {
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const { user, getReservationUser, cancleReservation } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState({});
    const [refresh, setRefresh] = useState("");

    useEffect(() => {
        getHistoryList();
    }, [refresh])

    const getHistoryList = () => {
        if (user.id) {
            setLoading(true);
            getReservationUser(user.id).then((res) => {
                if (res.data.status) {
                    setData(res.data.data);
                    setLoading(false);
                }
            })
        }
    }



    const columns = [
        {
            title: 'Mã đặt vé',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id) => <>{id}</>,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (_, { status }) => {
                let curent = status == "Chưa thanh toán" ? 1 : status == "Đã hủy" ? 1 : 2;
                let descriptionTep2 = status == "Đã hủy" ? "Vé đã hủy" : "Chờ thanh toán";
                if (status == "Thanh toán") {
                    descriptionTep2 = "Thanh toán thành công"
                }
                status = status == "Đã hủy" ? "error" : "process"

                return (
                    <Steps
                        size='small'
                        current={curent}
                        status={status}
                        type="inline"
                        items={[
                            {
                                title: 'Đặt vé',
                                description: 'Đặt vé thành công',
                            },
                            {
                                title: 'Thanh toán',
                                description: descriptionTep2,
                            },
                            {
                                title: 'Nhận vé',
                                description: "",
                            },
                        ]
                        }
                    />

                )
            }
        },
        {
            title: 'Thời gian đặt',
            key: 'created_at',
            dataIndex: 'created_at',
            width: 250,
            render: (_, { created_at }) => {
                return (
                    <>
                        {moment(created_at).format(dateFormat)}
                    </>
                );
            }
        },
        {
            title: 'Chi tiết',
            key: 'detail',
            dataIndex: 'detail',
            width: 50,
            render: (_, record) => {
                return (
                    <>
                        <Button onClick={() => setDraw(record)}>Chi tiết</Button>
                    </>
                );
            }
        },
        // {

        //     title: 'Actions',
        //     dataIndex: 'action',
        //     key: 'action',
        //     width: 300,
        //     render: (_, record) => {

        //         let disableTranfer = false, disablePay = false, disableCancle = false;
        //         if (record.status == "Đã hủy") {
        //             disablePay = true;
        //             disableCancle = true;
        //             disableTranfer = true;
        //         }

        //         if (record.status == "Thanh toán") {
        //             disablePay = true;
        //             // disableCancle = true;
        //         }

        //         return <>
        //             <Space.Compact block>
        //                 <Tooltip title="Thanh toán">
        //                     <Dropdown menu={menuProps} disabled={disablePay}>
        //                         <Button style={{ marginRight: 10 }} type="primary" disabled={disablePay}>Thanh toán</Button>
        //                     </Dropdown>
        //                 </Tooltip>
        //                 <Tooltip title="Đổi vé">
        //                     <Button icon={<SwapOutlined />} disabled={disableTranfer} style={{ marginRight: 10 }} >Đổi vé</Button>
        //                 </Tooltip>
        //                 <Tooltip title="Hủy vé">
        //                     <Popconfirm
        //                         placement="bottomRight"
        //                         title={"Hủy đặt vé này"}
        //                         onConfirm={() => cancleReseve(record)}
        //                         okText="Có"
        //                         cancelText="Không"
        //                         disabled={disableCancle}
        //                     >
        //                         <Button icon={<StopOutlined />} disabled={disableCancle} danger  >Trả vé</Button>
        //                     </Popconfirm>
        //                 </Tooltip>
        //             </Space.Compact>

        //         </>
        //     },
        // },
    ];


    const setDraw = (record) => {
        setItem(record);
        setOpen(true);
    }



    return (
        <div className="me">
            <Row>
                <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                    <br />
                    <Card
                        title="Lịch sử đặt vé"
                        bordered={false}
                        style={{
                            width: '100%',
                            height: '100%',

                        }}
                        bodyStyle={{
                            paddingTop: 0
                        }}
                    >
                        <Spin spinning={loading}>
                            <Table columns={columns} dataSource={data} rowKey='id' bordered />
                        </Spin>
                    </Card>
                </Col>

            </Row>
            <Detail item={item} setOpen={setOpen} open={open} setRefresh={setRefresh} />
        </div>
    )
}

export default History