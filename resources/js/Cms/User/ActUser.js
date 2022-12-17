import { RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Spin, Upload } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';

const initialValues = {
  category: 1,
  totalSeat: "0",
}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const ActUser = () => {
  const { createAccount, detailAccount, updateAccount, getListCinema, getListCategory } = useContext(AppContext);

  let navigate = useNavigate();
  const params = useParams();
  const [item, setItem] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();
  const [totalSeat, setTotalSeat] = useState();
  const [cinema, setCinema] = useState([]);

  const operations = <>
    <Button onClick={() => onSubmit()} type="primary" style={{ marginRight: 8 }} icon={<SaveOutlined />}>
      Lưu
    </Button>
    <Button onClick={() => navigate("/admin/users")} icon={<RollbackOutlined />}>
      Quay lại
    </Button>
  </>;

  useEffect(() => {
    getListCinema().then((res) => {
      setCinema(res.data.data)
    })
  }, [])

  useEffect(() => {
    if (params.id) {
      detailAccount({ id: params.id }).then((res) => {
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
      if (params.id) formData.append("id", params.id)
      if (values.name) formData.append("name", values.name)
      if (values.username) formData.append("username", values.username)
      if (values.password) formData.append("password", values.password)
      if (values.phone) formData.append("phone", values.phone)
      if (values.email) formData.append("email", values.email)
      formData.append("role_id", values.role_id == 0 ? 0 : values.role_id)

      if (params.id) {
        //update
        updateAccount(formData).then(function (res) {
          setLoadingForm(false)
          openNotification(res.data);
          navigate("/admin/users")
        })
      } else {
        //store
        createAccount(formData).then(function (res) {
          setLoadingForm(false)
          openNotification(res.data);
          navigate("/admin/users")
        })
      }
    })
  }

  const onFinish = (values) => {

    setLoading(true)
    axios.post('/api/register', values)
      .then((response) => {
        setLoading(false)
        if (response.data.status) navigate("/login");
        openNotification(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý rạp</Breadcrumb.Item>
        <Breadcrumb.Item>Rạp</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Card
          size="small"
          title={
            item.name ? <h3>{item.name}<br /><small>{item.username}</small></h3> : <h3>{'Thêm tài khoản'}</h3>
          }
          style={{ width: '100%' }}
          extra={operations}
        >
          <Spin tip="Loading..." spinning={loadingForm}>
            <Form
              // {...layout}
              // labelAlign="left"
              form={form}
              layout='vertical'
            >

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Tên"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                  // rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Nhập lại mật khẩu"
                    name="repassword"
                  // rules={[{ required: true, message: 'Please input your password again!' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                  >
                    <Input type="email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Tài khoản"
                    name="role_id"
                    rules={[{ required: true, message: 'Please select role!' }]}
                  >
                    <Select
                      optionFilterProp="children"
                      placeholder="Chọn loại tài khoản"
                    >
                      <Select.Option key={0} value={0}>Khách hàng</Select.Option>
                      <Select.Option key={1} value={1}>Nhân viên</Select.Option>
                      <Select.Option key={2} value={2}>Quản lý</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>

                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>

      </div>
    </>
  )
}

export default ActUser