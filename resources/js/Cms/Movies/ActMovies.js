import { RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Spin, Upload } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context'; 
import 'react-quill/dist/quill.snow.css';
import TextEditor from '../Helper/TextEditor';
import Actor from './Actor';

const initialValues = {
  category: 1,
  duration: "3.0",
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};
const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const ActMovies = () => {
  const { getMovies, storeMovies, updateMovies,  getListCountry, getListCategory, getActors} = useContext(AppContext);

  let navigate = useNavigate();
  const params = useParams();
  const [item, setItem] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();
  const [pic, setPic] = useState();
  const [country, setCountry] = useState([]);
  const [categories, setCategories] = useState([]);
 

  const operations = <>
    <Button onClick={() => onSubmit()} type="primary" style={{ marginRight: 8 }} icon={<SaveOutlined />}>
      Lưu
    </Button>
    <Button onClick={() => navigate("/admin/movies")} icon={<RollbackOutlined />}>
      Quay lại
    </Button>
  </>;

    useEffect(() => {
        getListCountry().then((res) => {
            setCountry(res.data.data);
        });
        getListCategory().then((res) => {
            setCategories(res.data.data);
        })
    }, [])

    useEffect(() => {
        if (params.id) {
          setLoadingForm(true)
          getMovies(params.id).then((res) => {
              var dataForm = res.data.data;
              dataForm.release_date = moment(dataForm.release_date);
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
        if (params.id) formData.append("id", params.id)

        if (values.title) formData.append("title", values.title)
        if (values.release_date) formData.append("release_date", moment(values.release_date).format('YYYY/MM/DD'));
        if (values.duration) formData.append("duration", values.duration)
        if (values.language) formData.append("language", values.language)
        if (values.category_id) formData.append("category_id", values.category_id)
        if (values.country_id) formData.append("country_id", values.country_id)
        if (values.description) formData.append("description", values.description)
        if (values.upload) {
          formData.append("image", values.upload[0].originFileObj);
        }
        if (params.id) {
            //update
            updateMovies(formData).then(function (res) {
            setLoadingForm(false)
            openNotification(res.data);
            navigate("/admin/movies")
            })
        } else {
            
            //store
            storeMovies(formData).then(function (res) {
            setLoadingForm(false)
            openNotification(res.data);
            navigate("/admin/movies")
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
        <Breadcrumb.Item>Phim</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Card
          size="small"
          title={
            item.title ? <h3>Phim: {item.title}<br /><small>ID: {item.id}</small></h3> : <h3>{'Thêm phim mới'}</h3>
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
                    label="Tên phim"
                    name="title"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input title' }]}
                  >
                    <Input placeholder="Please Input title" />
                  </Form.Item>        
                  <Form.Item
                    label="Ngày ra mắt"
                    name="release_date"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input' }]}
                  >
                    <DatePicker  format={dateFormat} />
                  </Form.Item>
                  <Form.Item
                    label="Thời lượng"
                    name="duration"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input duration' }]}
                  >
                    <InputNumber
                        style={{width: '100%'}}
                        min="0"
                        max="3"
                        step="0.01"
                        stringMode
                    />
                  </Form.Item>
                  <Form.Item
                    label="Quốc gia"
                    name="country_id"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input country' }]}
                  >
                    <Select
                      optionFilterProp="children"
                      placeholder="Select country"
                      showSearch
                    >
                        {country.map((record, index) => {
                            return (
                                <Select.Option key={index} value={record.id}>{record.name}</Select.Option>
                            )
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Ngôn ngữ"
                    name="language"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input language' }]}
                  >
                    <Input placeholder="Please Input language" />
                  </Form.Item>
                  <Form.Item
                    label="Danh mục phim"
                    name="category_id"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please select category' }]}
                  >
                    <Select
                      optionFilterProp="children"
                      placeholder="Select category"
                      showSearch
                    >
                        {categories.map((record, index) => {
                            return (
                                <Select.Option key={index} value={record.id}>{record.name}</Select.Option>
                            )
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Mô tả"
                    name="description"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input' }]}
                  >
                    <TextEditor style={{height: '200px'}}/>
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
                        src={APP_URL + '/images/movies' + pic}
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
            {params.id ? <Actor keyID={params.id} /> : <></>}
          </Spin>
        </Card>
      </div>
    </>
  )
}

export default ActMovies