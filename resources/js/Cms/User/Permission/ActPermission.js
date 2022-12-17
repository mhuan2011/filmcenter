import { RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Spin, Upload } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../../Client/Helper/Notification';
import { AppContext } from '../../../Context';


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const ActPermission = () => {
    const { getPermission, updatePermission, getListCinema, storePermission } = useContext(AppContext);

    let navigate = useNavigate();
    const params = useParams();
    const [item, setItem] = useState({});
    const [loadingForm, setLoadingForm] = useState(false);
    const [form] = Form.useForm();

    const operations = <>
        <Button onClick={() => onSubmit()} type="primary" style={{ marginRight: 8 }} icon={<SaveOutlined />}>
            Lưu
        </Button>
        <Button onClick={() => navigate("/admin/permission")} icon={<RollbackOutlined />}>
            Quay lại
        </Button>
    </>;

    useEffect(() => {
        if (params.id) {
            getPermission(params.id).then((res) => {
                form.setFieldsValue(res.data.data)
            })
        }
    }, []);

    const onSubmit = (values) => {
        form.validateFields().then((values) => {
            if (values.password !== values.repassword) {
                openNotification({ status: false, message: 'Mật khẩu không khớp!' })
                return;
            }
            setLoadingForm(true)
            const formData = new FormData();
            if (values.name) formData.append("name", values.name)
            if (params.id) formData.append("id", params.id)
            if (params.id) {
                //update
                updatePermission(formData).then(function (res) {
                    setLoadingForm(false)
                    openNotification(res.data);
                    navigate("/admin/permission")
                })
            } else {
                //store
                storePermission(formData).then(function (res) {
                    setLoadingForm(false)
                    openNotification(res.data);
                    navigate("/admin/permission")
                })
            }
        })
    }

    return (
        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Permissions</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
                <Card
                    size="small"
                    title={
                        item.name ? <h3>{item.name}<br /><small>{item.username}</small></h3> : <h3>{'Thêm quyền'}</h3>
                    }
                    style={{ width: '100%' }}
                    extra={operations}
                >
                    <Spin tip="Loading..." spinning={loadingForm}>
                        <Row>
                            <Col span={12}>
                                <Form
                                    {...layout}
                                    labelAlign="left"
                                    form={form}
                                >
                                    <Form.Item
                                        label="Tên"
                                        name="name"
                                        rules={[{ required: true, message: 'Please input role name!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Spin>
                </Card>
            </div>
        </>
    )
}

export default ActPermission