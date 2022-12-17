import { RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Spin, Upload } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../../Client/Helper/Notification';
import { AppContext } from '../../../Context';
import TextEditor from '../../Helper/TextEditor';

const initialValues = {
  category: 1,
  price: "10000",
  date_of_birth: moment('2000/1/1')
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};
const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const ActPerson = () => {
  let navigate = useNavigate();
  const params = useParams();
  const [item, setItem] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();
  const { getPerson, storePerson, updatePerson } = useContext(AppContext);
  const [pic, setPic] = useState();
  const [value, setValue] = useState('');

  const operations = <>
    <Button onClick={() => onSubmit()} type="primary" style={{ marginRight: 8 }} icon={<SaveOutlined />}>
      Lưu
    </Button>
    <Button onClick={() => navigate("/admin/person")} icon={<RollbackOutlined />}>
      Quay lại
    </Button>
  </>;

  useEffect(() => {
    if (params.id) {
      setLoadingForm(true)
      getPerson(params.id).then((res) => {
        var dataForm = res.data.data;
        dataForm.date_of_birth = moment(dataForm.date_of_birth);
        form.setFieldsValue(res.data.data)
        setPic(res.data.data.image)
        setItem(res.data.data)
        setLoadingForm(false)
      })
    }
  }, []);

  const onSubmit = () => {
    form.validateFields().then((values) => {
      setLoadingForm(true)
      const formData = new FormData();
      if (params.id) formData.append("person_id", params.id)

      if (values.name) formData.append("name", values.name)
      if (values.gender != null) formData.append("gender", values.gender)
      if (values.date_of_birth) formData.append("date_of_birth", values.date_of_birth)
      if (values.description) formData.append("description", values.description)
      if (values.upload) {
        formData.append("upload", values.upload[0].originFileObj);
      }
      if (params.id) {
        //update
        updatePerson(formData).then(function (res) {
          setLoadingForm(false)
          openNotification(res.data);
          navigate("/admin/person")
        })
      } else {
        //store
        storePerson(formData).then(function (res) {
          setLoadingForm(false)
          openNotification(res.data);
          navigate("/admin/person")
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

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý phim</Breadcrumb.Item>
        <Breadcrumb.Item>Đạo diễn - diễn viên</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Card
          size="small"
          title={
            item.name ? <h3>{item.name}<br /><small>{item.username}</small></h3> : <h3>{'Món ăn mới'}</h3>
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
                    label="Tên"
                    name="name"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input' }]}
                  >
                    <Input placeholder="Please Input" />
                  </Form.Item>
                  <Form.Item
                    label="Sinh nhật"
                    name="date_of_birth"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input' }]}
                  >
                    <DatePicker format={dateFormat} />
                  </Form.Item>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input' }]}
                  >
                    <Select
                      optionFilterProp="children"
                    >
                      <Select.Option key={1} value={0}>Nam</Select.Option>
                      <Select.Option key={2} value={1}>Nữ</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Mô tả"
                    name="description"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input' }]}
                  >
                    {/* <TextArea rows={5} placeholder="Please Input" /> */}
                    {/* <ReactQuill theme="snow" value={value} onChange={setValue}/> */}
                    <TextEditor style={{ height: '200px' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} xl={12}>
                  {pic &&
                    <Form.Item
                      label="Ảnh"
                      name="pic"
                    >
                      <Image
                        width={170}
                        src={APP_URL + '/images' + pic}
                      />
                    </Form.Item>
                  }
                  <Form.Item
                    label="Upload"
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: !params.id ? true : false, message: 'Please Input' }]}
                  >
                    <Upload name="pic" customRequest={dummyRequest} listType="picture">
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
      </div>
    </>
  )
}

export default ActPerson