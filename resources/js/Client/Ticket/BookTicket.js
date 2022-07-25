import { Affix, Button, Card, Carousel, Col, Divider, Row, Steps } from 'antd';
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


const BookTicket = () => {
  const [ticketInfor, setTicketInfor] = useState({});
  const [total, setTotal] = useState(0);

  const steps = [
    {
      title: 'Chọn vé',
      content:  <>
          <SelectTicket ticketInfor={ticketInfor} setTicketInfor={setTicketInfor} setTotal = {setTotal}/>
          <Combo ticketInfor={ticketInfor} setTicketInfor={setTicketInfor} setTotal = {setTotal}/>
      </>,
    },
    {
      title: 'Chọn ghế',
      content: <SeatMap/>,
    },
    {
      title: 'Xác nhận',
      content: <OrderForm/>,
    },
    {
      title: 'Đặt vé thành công',
      content: <ResultOrder/>,
    },
  ];
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
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
                          src="https://cdn.galaxycine.vn/media/2022/6/13/1350x900---copy_1655112805440.jpg"
                        />
                      }
                    >
                      <Meta
                          title="THOR: LOVE AND THUNDER"
                          description="THOR: LOVE AND THUNDER"
                      />
                      <div className="detail-ticket">
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Rạp: 
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Suất chiếu:
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Combo:
                        <Divider orientation="left" orientationMargin="0"></Divider>
                        Ghế:
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