import { ScheduleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Col, Collapse, Input, List, Menu, Row, Select, Spin, Tabs, Tag } from 'antd';
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
const { TabPane } = Tabs;
const {Option} = Select;
const { Panel } = Collapse;
const { Search } = Input;

const Ticket = () => {
  const [selected, setSelected] = useState('');
  const [selectTheater, setSelectTheater] = useState('');

  const menuItems = [
    {
      key: 'film_1',
      height: '100px',
      label: 
        <div>
          <Row >
              <Col span={8} >
              <img style={{height: '100px'}} src='https://cdn.galaxycine.vn/media/2022/6/13/1350x900---copy_1655112805440.jpg'></img>
              </Col>
              <Col span={16} >
                <h3 style={{margin: 0}}>THOR: LOVE AND THUNDER THOR </h3>
                TÌNH YÊU VÀ SẤM SÉT  <Tag color="#f50">16+</Tag>
              </Col>
          </Row>
        </div>
      ,
    },
    {
      key: 'film_2',
      label: <div>
          <Row >
              <Col span={8} >
              <img style={{height: '100px'}} src='https://cdn.galaxycine.vn/media/2022/6/14/1350wx900h_1655176461942.jpg'></img>
              </Col>
              <Col span={16} >
                  <Row>
                    <Col>
                      
                    </Col>
                  </Row>
              </Col>
          </Row>
      </div>,
    },
  
  ];

  const theaterMenu = [
    {
      key: 'theater_1',
      height: '100px',
      label: 
        <div>
          <Row style={{padding: 10}} justify="space-between">
            <Col><p style={{margin: 0}}>Filmcenter Phạm Văn Đồng </p></Col>
            <Col>
              <Button>Xem vị trí</Button>
            </Col>

          </Row>
        </div>
      ,
    },
    {
      key: 'theater_2',
      label: <div>
          <Row style={{padding: 10}}>
            <p style={{margin: 0}}>Filmcenter Nguyễn Trãi </p>
          </Row>
      </div>,
    },
  
  ];
  
  const onClick = (e) => {
    setSelected(e.key);
  };
  const choosenTheater = (e) => {
      setSelectTheater(e.key);
  }
  return (
    <div className="buying-ticket">
        
        <Row>
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                <br />
                <Card
                  title="MUA VÉ"
                  bordered={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    
                  }}
                  bodyStyle = {{
                    paddingTop: 0
                  }}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <VideoCameraOutlined />
                          THEO PHIM
                        </span>
                      }
                      key="1"
                    >
                        <Spin tip="Loading..." spinning={false}>
                            <Row gutter={[16, 16]}>
                              <Col md={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 0 }}>
                                  <Card
                                      title="CHỌN PHIM" 
                                      hoverable
                                      bodyStyle={{
                                        padding: 10
                                      }}
                                    >
                                      {/* <Search placeholder="Tìm phim"  style={{ width: '100%' }} /> */}
                                      
                                      <Menu onClick={onClick} items={menuItems} selectedKeys={selected} mode="inline" className='film-menu'/>
                                </Card>
                              </Col>
                              <Col md={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 0 }}>
                                  <Card
                                      title="CHỌN RẠP"
                                      hoverable
                                      bodyStyle={{
                                        padding: 10
                                      }}
                                    >
                                      <Menu onClick={choosenTheater} items={theaterMenu} selectedKeys={selectTheater} mode="inline" className='theater-menu'/>
                                      {/* <Meta  description="Vui lòng chọn rạp" /> */}
                                </Card>
                              </Col>
                              <Col md={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 0 }}>
                                  <Card
                                      title="CHỌN SUẤT"
                                      hoverable
                                      bodyStyle={{
                                        padding: 10
                                      }}
                                    >
                                      <Collapse defaultActiveKey={['1']} >
                                        <Panel header="Thu 7 (7.17.2022)" key="1">
                                          <Row>
                                            <Col span={8}>
                                              2D - Phụ đề
                                            </Col>
                                            <Col span={16}>
                                              <Row gutter={[16, 16]}>
                                                <Col><Button>12:30</Button></Col>
                                                <Col><Button>12:30</Button></Col>
                                                <Col><Button>12:30</Button></Col>
                                                <Col><Button>12:30</Button></Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </Panel>
                                        <Panel header="This is panel header 2" key="2">
                                          <p>Chu Nhat (7.18.2022)</p>
                                        </Panel>
                                        <Panel header="This is panel header 3" key="3">
                                          <p>Thu 2 (7.19.2022)</p>
                                        </Panel>
                                      </Collapse>
                                      {/* <Meta  description="Vui lòng chọn suất chiếu" /> */}
                                </Card>
                              </Col>
                            </Row>
                        </Spin>
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <ScheduleOutlined />
                          THEO RẠP
                        </span>
                      }
                      key="2"
                    >
                    </TabPane>
                  </Tabs>
                </Card>
                
            </Col>
        </Row>
    </div>
  )
}

export default Ticket