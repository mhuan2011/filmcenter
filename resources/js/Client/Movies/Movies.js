import { Button, Card, Carousel, Col, Form, Input, Row, Select, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
import MovieItem from './MovieItem.js';

const Option = Select.Option;
const Movies = () => {
    const { getListMovies, getListCategory, getListCountry, filterMovies} = useContext(AppContext);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    const [country, setCountry] = useState([]);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      getListMovies().then((res)=>{
        setData(res.data.data);
        setLoading(false);
      })

      getListCategory().then((res) => {
        setCategory(res.data.data);
      })

      getListCountry().then((res) => {
        setCountry(res.data.data);
      })
    }, [])

    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };

    const onFinish = (values) => {
      setLoading(true);
      var val = {};
      if(values.title ) {
        val.title = values.title;
      }
      if(values.category ) {
        val.category = values.category;
      }

      if(values.country ) {
        val.country = values.country;
      }

      filterMovies(val).then((res)=>{
        setData(res.data.data);
        setLoading(false);
      })
    };
  return (
    <div className="list-movies">
        <Row>
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                <br />
                <Card bordered={false}>
                    <Spin tip="Đang tải..." spinning={loading}>
                        <Card title="DANH SÁCH PHIM" bordered={false}>
                          
                            <Row gutter={[4, 4]}>
                                <Form
                                  layout="inline"
                                  form={form}
                                  labelAlign="left"
                                  onFinish={onFinish}
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
                                        showSearch
                                        style={{
                                          width: 220,
                                        }}
                                        allowClear
                                        placeholder="Chọn thể loại"
                                      >
                                        {
                                          category.map((item, index) => (
                                               <Option value={item.id} key={index}>{item.name}</Option>
                                            )
                                          ) 
                                            
                                        }
                                      </Select>
                                  </Form.Item>
                                  <Form.Item
                                    label="Quốc gia"
                                    name="country"
                                    style={{ marginBottom: 15 }}
                                  >
                                      <Select
                                        style={{
                                          width: 180,
                                        }}
                                        showSearch
                                        allowClear
                                        placeholder="Chọn quốc gia"
                                      >
                                        {
                                          country.map((item, index) => (
                                               <Option value={item.id} key={index}>{item.name}</Option>
                                            )
                                          ) 
                                            
                                        }
                                      </Select>
                                  </Form.Item>
                                  <Form.Item>
                                    <Button type="primary" htmlType="submit" >Lọc</Button>
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