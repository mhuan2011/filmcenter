import { RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Spin, TimePicker, Upload } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';
import 'react-quill/dist/quill.snow.css';
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
const dateFormat = 'YYYY/MM/DD';
const ActShow = () => {
  const { getShow, storeShow, updateShow,  getListMovies, getListCinemalHall} = useContext(AppContext);

  let navigate = useNavigate();
  const params = useParams();
  const [item, setItem] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();

  const [movies, setMovies] = useState([]);
  const [cinemaHall, setCinameHall] = useState([]);
  const [startTime, setStartTime] = useState(null);



  const operations = <>
    <Button onClick={() => onSubmit()} type="primary" style={{ marginRight: 8 }} icon={<SaveOutlined />}>
      Lưu
    </Button>
    <Button onClick={() => navigate("/admin/show")} icon={<RollbackOutlined />}>
      Quay lại
    </Button>
  </>;

    useEffect(() => {
        getListMovies().then((res) => {
            setMovies(res.data.data);
        });
        getListCinemalHall().then((res) => {
            setCinameHall(res.data.data);
        });
    }, [])

    useEffect(() => {
        if (params.id) {
        setLoadingForm(true)
        getShow(params.id).then((res) => {

            var dataSource = res.data.data;
            dataSource.date = moment(dataSource.date)
            dataSource.start_time = moment(dataSource.start_time, 'HH:mm:ss');
            dataSource.end_time = moment(dataSource.end_time, 'HH:mm:ss');

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
        if (values.date) formData.append("date", moment(values.date).format('YYYY-MM-DD'))
        if (values.start_time) formData.append("start_time", moment(values.start_time).format('hh:mm:ss'))
        if (values.end_time) formData.append("end_time", moment(values.end_time).format('hh:mm:ss'))
        if (values.movie_id) formData.append("movie_id", values.movie_id)
        if (values.cinema_hall_id) formData.append("cinema_hall_id", values.cinema_hall_id)

        if (params.id) {
            //update
            updateShow(formData).then(function (res) {
            setLoadingForm(false)
            openNotification(res.data);
            navigate("/admin/show")
            })
        } else {
            //store
            storeShow(formData).then(function (res) {
            setLoadingForm(false)
            openNotification(res.data);
            navigate("/admin/show")
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
                    label="Ngày chiếu"
                    name="date"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input name' }]}
                  >
                    <DatePicker />
                  </Form.Item>        
                  <Form.Item
                    label="Thời gian bắt đầu"
                    name="start_time"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input duration' }]}
                  >
                    <TimePicker />
                    
                  </Form.Item>
                  <Form.Item
                    label="Thời gian kết thúc"
                    name="end_time"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input name' }]}
                  >
                    <TimePicker />
                  </Form.Item>   
                  <Form.Item
                    label="Phim"
                    name="movie_id"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input name' }]}
                  >
                    <Select
                      optionFilterProp="children"
                      placeholder="Select category"
                    >
                        {movies.map((record, index) => {
                            return (
                                <Select.Option key={index} value={record.id}>{record.title}</Select.Option>
                            )
                        })}
                    </Select>
                  </Form.Item>  
                  <Form.Item
                    label="Rạp"
                    name="cinema_hall_id"
                    style={{ marginBottom: 15 }}
                    rules={[{ required: true, message: 'Please Input name' }]}
                  >
                    <Select
                      optionFilterProp="children"
                      placeholder="Select category"
                    >
                        {cinemaHall.map((record, index) => {
                            return (
                                <Select.Option key={index} value={record.id}>{record.name}</Select.Option>
                            )
                        })}
                    </Select>
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

export default ActShow