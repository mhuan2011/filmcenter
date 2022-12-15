
import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Form, Input, Button, Row, Col,
    Drawer, Spin, Upload, Select, Space, Image
} from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { AppContext } from "../../Context";
import { openNotification } from "../../Client/Helper/Notification";

const { Search, TextArea } = Input;
const intialValue = {
    name: "",
    description: "",
}
const ActCategory = ({ visible, setDraw, keyID, refresh, setKey }) => {
    const { storeCategory, updateCategory, getItemCategory } = useContext(AppContext);
    const [loadingForm, setLoadingForm] = useState(false);
    const [form] = Form.useForm();



    useEffect(() => {
        if (keyID) {
            setLoadingForm(true);
            getItemCategory(keyID).then(function (res) {
                form.setFieldsValue(res.data.data);
                setLoadingForm(false);
            })
        }

    }, [keyID])

    const onClose = () => {
        setKey(null);
        form.setFieldsValue({ name: "", description: "" });
        setDraw(false);
    };


    const onSave = () => {
        form.validateFields()
            .then((values) => {
                var formData = new FormData()
                if (values.name) formData.append("name", values.name)
                if (values.description) formData.append("description", values.description)
                setLoadingForm(true)
                if (keyID) {
                    updateCategory(keyID, formData).then(function (res) {
                        refresh(new Date());
                        setLoadingForm(false)
                        openNotification(res.data);

                    }).catch((err) => {
                        openNotification({ status: false, message: err.response.data.message });
                    })
                } else {
                    storeCategory(formData).then(function (res) {
                        setLoadingForm(false)
                        refresh(new Date());
                        openNotification(res.data);

                    }).catch((err) => {
                        openNotification({ status: false, message: err.response.data.message });
                    })
                }
                onClose();

            })
    }
    return (
        <Drawer
            title="Category"
            onClose={onClose}
            width={500}
            visible={visible}
            extra={
                <Space>
                    <Button >Cancel</Button>
                    <Button type="primary" onClick={onSave}>
                        Save
                    </Button>
                </Space>
            }
        >
            <Spin tip="Loading..." spinning={loadingForm}>
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={intialValue}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input category name!' }]}
                    >
                        <Input placeholder="Please input name !" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea placeholder="Please input description!" rows={15} />
                    </Form.Item>
                </Form>
            </Spin>
        </Drawer>
    );
}
export default ActCategory;
