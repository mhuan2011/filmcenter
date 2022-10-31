import { Button, Card, Carousel, Col, DatePicker, Form, Row, Select, Tabs } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AndroidOutlined, AppleOutlined, HomeOutlined, ScheduleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { AppContext } from '../../../Context.js';
import helper from '../../Helper/helper.js';
import moment from 'moment';
const { TabPane } = Tabs;
const {Option} = Select;

const ByShowDate = () => {
  let navigate = useNavigate();
  const { user, getShowDate, getMoviesWithCinemaAndDate , getShowWithCinemaMovies } = useContext(AppContext);
  const [show, setShow] = useState([]);
  const [dateShow, setDateShow] = useState([]);
  const [cinema, setCinema] = useState([]);
  const [movie, setMovie] = useState([]);
  const [timeList, setTimeList] = useState([]);

  const [showID, setShowID] = useState(null);
  const [date, setDate] = useState(null);
  const [movieID, setMovieID] = useState(null);
  const [cinemaID, setCinemaID] = useState(null);

  useEffect(() => {
    getShowDate().then((res)=>{
      setDateShow(res.data.data);
    })
  },[]);

  const getCinema = (id) => {

    setDate(dateShow[id].date);
    setCinema(dateShow[id].cinema)
  }

  const getMovies = ( id) => {
    setCinemaID(id);
    if(id) {
      var formData = new FormData()
      formData.append("cinema_id", id);
      formData.append("date", date);
      console.log("ok")
      getMoviesWithCinemaAndDate(formData).then((res) => {
        console.log(res.data.data)
        setMovie(res.data.data);
      });
    }
  }

  const getTime = ( id) => {
    setMovieID(id);
    if(id) {
      var formData = new FormData()
      formData.append("cinema_id", cinemaID);
      formData.append("movie_id", id);
      formData.append("date_selected", date);
      getShowWithCinemaMovies(formData).then((res) => {
        setTimeList(res.data.data);
      });
    }
  }

  const selectShow = (id) => {
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
          optionFilterProp="children"
          onChange={getCinema}
          style={{ width: "100%", marginRight: 0 }}
        >
          {dateShow.map((item, index)=> (
            <Option value={index} key={index}>{helper.formatDateToShow(item.date)}</Option>
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
          onChange={getMovies}
          style={{ width: "100%", marginRight: 0 }}
        >
          {cinema.map((item, index)=> (
            <Option value={item.id} key={index}>{item.name}</Option>
          ))}
        </Select>
      </Form.Item>

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
          onChange={getTime}
          style={{ width: "100%", marginRight: 0 }}
        >
         {movie.map((item, index)=> (
            <Option value={item.id} key={index}>{item.title}</Option>
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
            <Button  type="primary" onClick={() => buyTicket()}>Mua vé</Button>
          </Col>
        </Row>
        
      </Form.Item>
    </Form>
  )
}

export default ByShowDate;