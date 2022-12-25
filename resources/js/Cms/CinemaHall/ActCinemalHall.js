import { RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Spin, Switch, Upload } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';
import SeatMap from './SeatMap';

const initialValues = {
  category: 1,
  status: 1,
  totalSeat: "0",
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};
const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const ActCinemalHall = () => {
  const { getCinemalHall, storeCinemalHall, updateCinemalHall, getListCinema, getListCategory } = useContext(AppContext);

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
    <Button onClick={() => navigate("/admin/cinema-hall")} icon={<RollbackOutlined />}>
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
      setLoadingForm(true)
      getCinemalHall(params.id).then((res) => {
        form.setFieldsValue(res.data.data)
        setTotalSeat(res.data.data.total_seat);
        setItem(res.data.data)
        setLoadingForm(false)
      })
    }
  }, []);

  const onSubmit = () => {
    form.validateFields().then((values) => {
      setLoadingForm(true)
      const formData = new FormData();
      if (params.id) formData.append("id", params.id)
      if (values.name) formData.append("name", values.name)
      formData.append("status", values.status ? 1 : 0)
      if (values.total_seat) formData.append("total_seat", values.total_seat)

      if (params.id) {
        if (values.cinema_id) formData.append("cinema_id", values.cinema_id)
        //update
        updateCinemalHall(formData).then(function (res) {
          setLoadingForm(false)
          openNotification(res.data);
          // navigate("/admin/cinema-hall")
        })
      } else {
        if (values.cinema_id) formData.append("cinema", values.cinema_id)
        //store
        storeCinemalHall(formData).then(function (res) {
          setLoadingForm(false)
          openNotification(res.data);
          // navigate("/admin/cinema-hall")
        })
      }
    })
  }
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };


  const onChange = (value) => {
    setTotalSeat(value);
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
            item.name ? <h3>{item.name}<br /><small>{item.username}</small></h3> : <h3>{'Thêm rạp mới'}</h3>
          }
          style={{ width: '100%' }}
          extra={operations}
        >
          <Spin tip="Loading..." spinning={loadingForm}>
            <Form
              {...formItemLayout}
              layout="horizontal"
              form={form}
              labelAlign="left"
              initialValues={initialValues}
            >
              <Row>
                <Col xs={24} xl={12}>
                  <Form.Item
                    label="Tên rạp"
                    name="name"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input name' }]}
                  >
                    <Input placeholder="Please Input name" />
                  </Form.Item>
                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please select status' }]}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="Rạp"
                    name="cinema_id"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input name' }]}
                  >
                    <Select
                      optionFilterProp="children"
                      placeholder="Select category"
                    >
                      {cinema.map((record, index) => {
                        return (
                          <Select.Option key={index} value={record.id}>{record.name}</Select.Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Số ghế"
                    name="total_seat"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input duration' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min="0"
                      max="100"
                      step="14"
                      stringMode
                      onChange={onChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
        <SeatMap totalSeat={totalSeat} />
      </div>
    </>
  )
}

export default ActCinemalHall