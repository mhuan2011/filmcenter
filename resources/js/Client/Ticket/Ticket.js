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
  const { getMoviesShow, getCinemaWithMovie  } = useContext(AppContext);
  const [movies, setMovies] = useState([]);
  const [cinema, setCinema  ] = useState([]);

  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingCinema, setLoadingCinema] = useState(false);


  useEffect(()=> {
    setLoadingMovies(true);
    getMoviesShow().then((res) => {
      createListMovies(res.data.data);
      setLoadingMovies(false)
    });
  },[])

  const createListMovies = (listMovies) => {
    var movies_menu = []
    if(listMovies) {
      listMovies.map((item, index) => {
        var temp = {
          key: item.id,
          height: '100px',
          label: 
            <div>
              <Row >
                  <Col span={8} >
                  <img style={{height: '100px'}} src={APP_URL + '/images/movies' + item.image}></img>
                  </Col>
                  <Col span={16} >
                    <h3 style={{margin: 0}}> {item.title}</h3>
                    Ngôn ngữ: {item.language} <Tag color="#f50">16+</Tag>
                  </Col>
              </Row>
            </div>
          ,
        }
        movies_menu.push(temp);
      })
      setMovies(movies_menu);
    }
  }

  const creatListCinema = (listCinema) => {
    var cinema_menu = []
    if(listCinema) {
      listCinema.map((item, index) => {
        var temp = {
          key: item.id,
          height: '100px',
          label: 
            <div>
              <Row style={{padding: 10}} justify="space-between">
                <Col><p style={{margin: 0}}>{item.name}</p></Col>
                <Col>
                  <Button>Xem vị trí</Button>
                </Col>
              </Row>
            </div>
          ,
        }
        cinema_menu.push(temp);
      })
      setCinema(cinema_menu);
    }
  } 

  
  
  const onClick = (e) => {
    setSelected(e.key);
    setSelectTheater("");
    if(e.key) {
      setLoadingCinema(true);
      getCinemaWithMovie(e.key).then((res) => {
        creatListCinema(res.data.data);
        setLoadingCinema(false);
      });
    }
  };


  const choosenTheater = (e) => {
      setSelectTheater(e.key);
      if(e.key) {
        // setLoadingCinema(true);
        // getCinemaWithMovie(e.key).then((res) => {
        //   creatListCinema(res.data.data);
        //   setLoadingCinema(false);
        // });
      }
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
                                      <Search placeholder="Tìm phim"  style={{ width: '100%' }} />
                                      <Spin spinning={loadingMovies}>
                                        <Menu onClick={onClick} items={movies} selectedKeys={selected} mode="inline" className='film-menu'/>
                                      </Spin>
                                </Card>
                              </Col>
                              <Col md={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 0 }}>
                                  <Card
                                      title="CHỌN RẠP"
                                      hoverable
                                      bodyStyle={{
                                        padding: 10,
                                        height: '100%'
                                      }}
                                    >
                                      <Spin spinning={loadingCinema}>
                                      {cinema.length == 0 ?
                                        <Meta  description="Vui lòng chọn phim" /> :
                                        <Menu onClick={choosenTheater} items={cinema} selectedKeys={selectTheater} mode="inline" className='theater-menu'/>
                                      }
                                      </Spin>
                                      
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