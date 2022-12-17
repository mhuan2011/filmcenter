import { RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Spin, TimePicker, Upload } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';
import TextEditor from '../Helper/TextEditor';

const initialValues = {
  category: 1,
  totalSeat: "0",
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};
const { Search, TextArea } = Input;

const ActCinema = () => {
  const { storeCinema, updateCinema, getCinema } = useContext(AppContext);

  let navigate = useNavigate();
  const params = useParams();
  const [item, setItem] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();




  const operations = <>
    <Button onClick={() => onSubmit()} type="primary" style={{ marginRight: 8 }} icon={<SaveOutlined />}>
      Lưu
    </Button>
    <Button onClick={() => navigate("/admin/show")} icon={<RollbackOutlined />}>
      Quay lại
    </Button>
  </>;

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (params.id) {
      setLoadingForm(true)
      getCinema(params.id).then((res) => {
        var dataSource = res.data.data;
        form.setFieldsValue(dataSource)
        setItem(dataSource)
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
      if (values.address) formData.append("address", values.address);

      if (params.id) {
        //update
        updateCinema(formData).then(function (res) {
          setLoadingForm(false)
          openNotification(res.data);
          navigate("/admin/cinema");
        })
      } else {
        //store
        storeCinema(formData).then(function (res) {
          setLoadingForm(false)
          openNotification(res.data);
          navigate("/admin/cinema");
        })
      }
    })
  }

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
            item.name ? <h3>{item.name}<br /><small>{item.username}</small></h3> : <h3>{'Thêm lịch chiếu'}</h3>
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
                    <Input placeholder='Nhập tên rạp' />
                  </Form.Item>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input duration' }]}
                  >
                    <TextArea rows={5} placeholder='Nhập địa chỉ' />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>



        </Card>

        {/* <SeatMap totalSeat={totalSeat}/> */}
      </div>
    </>
  )
}

export default ActCinema