import { Affix, Button, Card, message, Col, Divider, Row, Steps } from 'antd';
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
import helper from '../Helper/helper.js';
import Combo from './Step/Combo.js';
import OrderForm from './Step/OrderForm.js';
import ResultOrder from './Step/ResultOrder.js';
import SeatMap from './Step/SeatMap.js';
import SelectTicket from './Step/SelectTicket.js';


const { Step } = Steps;

const initialTicketInfor = {
  ticketType: [],
  reserveSeat: []
}
const BookTicket = () => {
  const { getInforShow, getMovies } = useContext(AppContext);
  const [ticketInfor, setTicketInfor] = useState({initialTicketInfor});
  const [total, setTotal] = useState(0);
  const [seat, setSeat] = useState(0);
  const [data, setData] = useState([]);
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const showId = queryParams.get('showId');
    getInforShow(showId).then(function (res) {
      setData(res.data.data);
      });
    setTicketInfor(initialTicketInfor);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const movieId = queryParams.get('movieId');
    if(movieId) {
      getMovies(movieId).then(function (res) {
        console.log("movieID", movieId);    
        setMovie(res.data.data);
      });
    }
  }, []);

  const steps = [
    {
      title: 'Chọn vé',
      content:  <>
          <SelectTicket ticketInfor={ticketInfor} setTicketInfor={setTicketInfor} setTotal = {setTotal}/>
          {/* <Combo ticketInfor={ticketInfor} setTicketInfor={setTicketInfor} setTotal = {setTotal}/> */}
      </>,
    },
    {
      title: 'Chọn ghế',
      content: <SeatMap ticketInfor={ticketInfor} setTicketInfor={setTicketInfor} total= {total} setSeat={setSeat}/>,
    },
    {
      title: 'Xác nhận',
      content: <OrderForm ticketInfor={ticketInfor} setTicketInfor={setTicketInfor} total= {total} setSeat={setSeat}/>,
    },
    // {
    //   title: 'Đặt vé thành công',
    //   content: <ResultOrder/>,
    // },
  ];
  const [current, setCurrent] = useState(0);

  const next = () => {
    if(current == 0) {
      if(!ticketInfor.ticketType ) {
        helper.openNotification("Thông báo", "Vui lòng chọn số lượng vé");
      }else {
        if(ticketInfor.ticketType.length == 0) {
          helper.openNotification("Thông báo", "Vui lòng chọn số lượng vé");
        }else
        setCurrent(current + 1);
      }
      
    }else if(current == 1) {
      //get total seat
      let totalSeat = 0;
      ticketInfor.ticketType.forEach(element => {
        totalSeat +=element.quantity;
      });
      if(seat.length < totalSeat) {
        // helper.openNotification("Thông báo", `Vui lòng chọn đủ ${totalSeat} ghế!`);

        message.warning(`Vui lòng chọn đủ ${totalSeat} ghế!`);
      }else {
        setCurrent(current + 1);
      }
    }
    else {
      setCurrent(current + 1);
    }
   
  };



  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="progress-ticking">
      <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                <br />
        <Row>
          <Card
            title="TIẾN TRÌNH MUA VÉ"
            bordered={false}
            style={{
              width: '100%',
              height: '100%',
              
            }}
            bodyStyle = {{
              paddingTop: 20,
            }}
          > 
              <Steps current={current} type="navigation">
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <Row gutter={10} style={{padding: 10}}>
                <Col span={18}>
                  <div className="steps-content">{steps[current].content}</div>
                  <div className="steps-action">
                  {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                      Trước
                    </Button>
                  )}
                  {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                      Tiếp
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                      Hoàn thành
                    </Button>
                  )}
                  
                </div>
                </Col>
                <Col span={6} >
                  <Affix offsetTop={70}>
                  <Card >
                    <Card
                      style={{ width: '100%' }}
                      cover={
                        <img
                          alt="example"
                          src={APP_URL + '/images/movies' + movie.image}
                        />
                      }
                    >
                      <Meta
                          title={movie.title}
                          // description="THOR: LOVE AND THUNDER"
                      />
                      <div className="detail-ticket">
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Rạp: { data.cinema_hall ? data.cinema_hall.name : <></>}
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Suất chiếu: {data.date +" ("+data.start_time +")"}
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Combo:
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Ghế: {seat ? seat.map(item => (item.rowChart+item.seat.number+", ")) : <></>}
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Tổng: {helper.formatCurrency(total)}
                      </div>
                    </Card>
                  </Card>
                  </Affix>
                </Col>
              </Row>
              
              
            
          </Card>
        </Row>
      </Col>

      
    </div>
  )
}

export default BookTicket