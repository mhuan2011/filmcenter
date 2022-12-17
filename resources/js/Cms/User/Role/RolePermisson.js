import { CheckOutlined, RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Drawer, Typography, Image, Input, InputNumber, Row, Select, Space, Spin, Table, Tooltip, Upload } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../../Client/Helper/Notification';
import { AppContext } from '../../../Context';


const { Link, Text } = Typography;

const RolePermisson = ({ open, setOpen, itemCP }) => {
    const { getListPermission, addPermissionToRole, getPermissionOfRole } = useContext(AppContext);
    const [data, setData] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [selected, setSelected] = useState([]);


    let navigate = useNavigate();

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getPerOfRole();
    }, [itemCP])

    const getPerOfRole = () => {
        if (itemCP.id) {
            let formData = new FormData();
            formData.append("role_id", itemCP.id);
            setLoadingTable(true);
            getPermissionOfRole(formData).then((res) => {

                var permissions = [];
                if (res.data.data) {
                    res.data.data.forEach(ele => {
                        permissions.push(ele.id);
                    });
                }
                setSelected(permissions);
                setLoadingTable(false);
            })
        }
    }

    const onSelect = (record) => {
        const formData = new FormData();
        if (record.id) formData.append("permission_id", record.id)
        if (itemCP.id) formData.append("role_id", itemCP.id)

        var check = selected.find(ele => ele == record.id);
        var type = "add";
        if (check) {
            type = "remove"
        }
        formData.append("type", type);
        //update
        addPermissionToRole(formData).then(function (res) {
            if (res.data.status) {
                getPerOfRole();
            }
            openNotification(res.data);
        })
    }

    const columns = [
        {
            title: '',
            dataIndex: 'status',
            key: 'status',
            width: 40,
            render: (_, record) => {
                return (
                    <Tooltip placement="bottom" title="Click to add/remove">
                        <Button type={selected.find(ele => ele == record.id) ? "primary" : "dashed"} shape="circle" icon={<CheckOutlined />} onClick={() => onSelect(record)}></Button>
                    </Tooltip>
                )
            }
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            dataIndex: 'Edit',
            key: 'edit',
            width: 50,
            render: (_, record) => {
                return (
                    <Link href={'permission/detail/' + record.id} target="_blank">
                        Edit
                    </Link>
                )
            }
        },
    ];

    useEffect(() => {
        setLoadingTable(true);
        getListPermission().then((res) => {
            if (res.data.status) {
                setData(res.data.data);
            }
            setLoadingTable(false)
        });
    }, [])

    return (
        <Drawer
            title={<>Role: {itemCP.name} <br></br><small><Text type="secondary">Thêm quyền cho vai trò</Text></small></>}
            width={720}
            onClose={onClose}
            visible={open}
            closable={false}
            bodyStyle={{
                paddingBottom: 80,
            }}
            extra={
                <Space>
                    <Button type='dashed' danger onClick={onClose}>Close</Button>
                </Space>
            }
        >

            <Table
                bordered
                columns={columns}
                dataSource={data}
                rowKey='id'
                loading={loadingTable}
            />

        </Drawer>
    )
}

export default RolePermisson