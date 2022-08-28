import { Button, Card, Carousel, Col, Form, Input, Row, Select, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
import MovieItem from './MovieItem.js';

const Option = Select.Option;
const Movies = () => {
    const { getListMovies } = useContext(AppContext);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      getListMovies().then((res)=>{
        setData(res.data.data);
        setLoading(false);
      })
    }, [])

    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };
  return (
    <div className="list-movies">
        <Row>
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                <br />
                <Card bordered={false}>
                    <Spin tip="Đang tải..." spinning={loading}>
                        <Card title="PHIM ĐANG CHIẾU" bordered={false}>
                          
                            <Row gutter={[4, 4]}>
                                <Form
                                  layout="inline"
                                  form={form}
                                  labelAlign="left"
                                >
                                  <Form.Item
                                    label="Tên phim"
                                    name="title"
                                    style={{ marginBottom: 15 }}
                                  >
                                    <Input placeholder='Nhập tên phim'/>
                                  </Form.Item>        
                                  <Form.Item
                                    label="Thể loại"
                                    name="category"
                                    style={{ marginBottom: 15 }}
                                  >
                                      <Select
                                        style={{
                                          width: 120,
                                        }}
                                        onChange={handleChange}
                                      >
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="disabled" disabled>
                                          Disabled
                                        </Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                      </Select>
                                  </Form.Item>
                                  <Form.Item
                                    label="Quốc gia"
                                    name="country"
                                    style={{ marginBottom: 15 }}
                                  >
                                      <Select
                                        style={{
                                          width: 120,
                                        }}
                                        onChange={handleChange}
                                      >
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="disabled" disabled>
                                          Disabled
                                        </Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                      </Select>
                                  </Form.Item>
                                  <Form.Item>
                                    <Button type="primary" >Lọc</Button>
                                  </Form.Item>
                              </Form>
                            </Row>
                            
                            <Row gutter={[16, 16]} style={{marginTop: '10px'}}>
                                
                                 {data.map((item, index)=> (
                                    <MovieItem key={index} item = {item}/>
                                 ))}
                                 
                            </Row>
                           
                        </Card>
                    </Spin>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default Movies