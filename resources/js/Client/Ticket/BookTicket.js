import { Button, Card, Carousel, Col, Row, Steps } from 'antd';
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
import SelectTicket from './Step/SelectTicket.js';
const { Step } = Steps;

const BookTicket = () => {
  const steps = [
    {
      title: 'Chọn vé',
      content:  <SelectTicket/>,
    },
    {
      title: 'Chọn ghế',
      content: 'Second-content',
    },
    {
      title: 'Chọn đồ ăn',
      content: 'Chọn đồ ăn',
    },
    {
      title: 'Xác nhận',
      content: 'Xác nhận',
    },
    {
      title: 'Đặt vé thành công',
      content: 'Final-content',
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
            {/* <Row> */}
              <Steps current={current} type="navigation">
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className="steps-content">{steps[current].content}</div>
              <div className="steps-action">
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={() => next()}>
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button type="primary" onClick={() => message.success('Processing complete!')}>
                    Done
                  </Button>
                )}
                {current > 0 && (
                  <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                    Previous
                  </Button>
                )}
              </div>
            {/* </Row> */}
            
          </Card>
        </Row>
      </Col>
    </div>
  )
}

export default BookTicket