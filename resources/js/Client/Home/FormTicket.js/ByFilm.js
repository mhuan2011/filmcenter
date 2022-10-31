import { Button, Card, Carousel, Col, DatePicker, Form, Row, Select, Tabs } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AndroidOutlined, AppleOutlined, HomeOutlined, ScheduleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { AppContext } from '../../../Context.js';
import { openNotification } from '../../Helper/Notification.js';
import helper from '../../Helper/helper.js';
import moment from 'moment';
const { TabPane } = Tabs;

const {Option} = Select;
const ByFilm = () => {
  let navigate = useNavigate();
  const { user, getMoviesShow, getCinemaWithMovie , getShowWithCinemaMovies } = useContext(AppContext);

  const [movies, setMovies] = useState([]);
  const [cinema, setCinema] = useState([]);
  const [show, setShow] = useState([]);
  const [timeList, setTimeList] = useState([]);

  const [movieID, setMovieID] = useState(null);
  const [cinemaID, setCinemaID] = useState(null);
  const [showID, setShowID] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    getMoviesShow().then((res)=>{
      setMovies(res.data.data);
      
    })
  },[]);

  const getCinema = ( id) => {
    getCinemaWithMovie(id).then((res) => {
      setMovieID(id);
      setCinema([]); setShow([]); setTimeList([]);
      setCinema(res.data.data);
    });
  }

  const getShowDate = ( id) => {
      setCinemaID(id);
      if(id) {
        var formData = new FormData()
        formData.append("cinema_id", id);
        formData.append("movie_id", movieID);
        getShowWithCinemaMovies(formData).then((res) => {
          setShow(res.data.data);
        });
      }
  }

  const getTime = ( id) => {
    setDate(show[id].date);
    setTimeList(show[id].show);
  }

  const selectShow = ( id) => {
    setShowID(id);
  }

  const buyTicket = () => {
    if(!movieID) {
      helper.notification({status: "warning", message: "Vui lòng chọn phim!!!"})
    }else {
      if(!cinemaID) {
        helper.notification({status: "warning", message: "Vui lòng chọn rạp!!!"})
      }
      else {
        if(!date) {
          helper.notification({status: "warning", message: "Vui lòng ngày!!!"})
        }else {
          if(!showID) {
            helper.notification({status: "warning", message: "Vui lòng suất chiếu!!!"})
          }else {
            if(user.role_id != "") {
              navigate(`/book-ticket?movieId=${movieID}&cinemaId=${cinemaID}&showId=${showID}`);
            }else {
              helper.notification({status: "warning", message: "Vui lòng đăng nhập để mua vé!!!"})
            }
          }
        }
      }
    }

     
  }

  return (
    <Form
      name="basic"
      labelCol={{
        span: 16,
      }}
      wrapperCol={{
        span: 24,
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <Form.Item
        name="film"
        rules={[
          {
            required: true,
            message: 'Chọn phim!',
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn phim"
          optionFilterProp="children"
          onChange={getCinema}
          style={{ width: "100%", marginRight: 0 }}
        >
          
          {movies.map((item, index)=> (
            <Option value={item.id} key={index}>{item.title}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="theater"
        rules={[
          {
            required: true,
            message: 'Chọn rạp!',
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn rạp"
          optionFilterProp="children"
          onChange={getShowDate}
          style={{ width: "100%", marginRight: 0 }}
        >
          {cinema.map((item, index)=> (
            <Option value={item.id} key={index}>{item.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="date_show"
        rules={[
          {
            required: true,
            message: 'Chọn ngày!',
          },
        ]}
        style={{ width: "100%", marginRight: 0 }}
      >
        <Select
          showSearch
          placeholder="Chọn ngày"
          onChange={getTime}
          optionFilterProp="children"
          style={{ width: "100%", marginRight: 0 }}
        >
          {show.map((item, index)=> (
            <Option value={index} key={index}>{item.date}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="show_time"
        rules={[
          {
            required: true,
            message: 'Chọn suất!',
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Chọn suất"
          optionFilterProp="children"
          onChange={selectShow}
          style={{ width: "100%", marginRight: 0 }}
        >
          {timeList.map((item, index)=> (
            <Option value={item.id} key={index}>{ moment(item.start_time, "HH:mm:ss").format("hh:mm")}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item >
        <Row>
          <Col
            span={24}
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary" onClick={() => buyTicket()}>Mua vé</Button>
          </Col>
        </Row>
        
      </Form.Item>
    </Form>
  )
}

export default ByFilm