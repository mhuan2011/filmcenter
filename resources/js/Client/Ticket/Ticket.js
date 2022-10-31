import { ScheduleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Col, Collapse, Input, List, Menu, Popover, Row, Select, Spin, Tabs, Tag } from 'antd';
import Meta from 'antd/lib/card/Meta.js';
import { stubString } from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
import helper from '../Helper/helper.js';

const { TabPane } = Tabs;
const {Option} = Select;
const { Panel } = Collapse;
const { Search } = Input;


const bookingInfor = {
  movie_id: null,
  ticket_id: null,
  show_id: null
}

const Ticket = () => {
  let navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [selectTheater, setSelectTheater] = useState('');
  const { user,  getMoviesShow, getCinemaWithMovie, getShowWithCinemaMovies  } = useContext(AppContext);
  const [movies, setMovies] = useState([]);
  const [cinema, setCinema  ] = useState([]);
  const [show, setShow  ] = useState([]);

  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingCinema, setLoadingCinema] = useState(false);
  const [loadingShow, setLoadingShow] = useState(false);

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
                  <Col span={8} style={{overflow: 'hidden'}}>
                  <img style={{height: '100px'}} src={APP_URL + '/images/movies' + item.image}></img>
                  </Col>
                  <Col span={16} style={{paddingLeft: '5px'}}>
                    <h3 style={{margin: 0}}> {item.title}</h3>
                    Ngôn ngữ: {item.language} 
                    {/* <Tag color="#f50">16+</Tag> */}
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
          height: "200px",
          label: 
            <div>
              <Row style={{padding: 10}} justify="space-between">
                <Col>
                <p style={{margin: 0}}>{item.name}</p>
                </Col>
                <Col>
                  <Popover placement="bottom" title={"Địa chỉ"} content={item.address} trigger="hover">
                    <Button>Xem vị trí</Button>
                  </Popover>
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
    setShow([]);
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
        setLoadingShow(true);
        var formData = new FormData()
        formData.append("cinema_id", e.key);
        formData.append("movie_id", selected);
        getShowWithCinemaMovies(formData).then((res) => {
          setShow(res.data.data);
          setLoadingShow(false);
        });
      }
  }

  const buyTicket = (detail) => {
    if(user.role_id != "") {
      navigate(`/book-ticket?movieId=${selected}&cinemaId=${selectTheater}&showId=${detail.id}`);
    }else {
      helper.notification({status: "warning", message: "Vui lòng đăng nhập để mua vé!!!"})
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
                                      <Spin spinning={loadingShow}>
                                      {show.length == 0 ? <Meta  description="Vui lòng chọn rạp" /> :  <Collapse  >{
                                        show.map((item, index) => (
                                          <Panel header={helper.formatDateToShow(item.date)} key={index}>
                                            <Row>
                                              <Col span={8}>
                                                2D - Phụ đề
                                              </Col>
                                              <Col span={16}>
                                                <Row gutter={[16, 16]}>
                                                  {item.show.map((detail) => (
                                                    <Col key={detail.id}><Button onClick={() => buyTicket(detail)}>{ moment(detail.start_time, "HH:mm:ss").format("hh:mm")}</Button></Col>
                                                  ))
                                                  }
                                                </Row>
                                              </Col>
                                            </Row>
                                          </Panel>
                                        ))
                                      }</Collapse>} 
                                      </Spin>
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