import { Button, Card, Carousel, Col, Result, Row } from 'antd';
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import {Link , useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';

const PaymentResult = () => {
  const {getParams, getResultPayment} = useContext(AppContext);
  const [result, setResult] = useState([]);
    useEffect(() => {
        let values = getParams();
        getResultPayment(values).then((res) => {
          setResult(res.data);
        })
        
    },[])
  const resultContainer = () => {
    var title = "";
    var type = "success"
    var message = `Đơn hàng ${result.OrderID} đã được thanh toán, mail và tin nhắn sẽ được gửi đến quý khách trong vài phút tới!`;
    if(result.RspCode == '00')  {
      title = "Thanh toán thành công!"
      type = "success";
    }
    else if(result.RspCode == '02' || result.RspCode == '99'){
      title = "Thanh toán không thành công!",
      type = "error";
    }
    return (
      <Card title="Kết quả" style={{margin: '10px', width: '100%', height: '100%'}}>
          <Result
              status={type}
              title={title}
              subTitle= {message}
              extra={[
              <Button type="primary" key="console">
                  Quay về trang chủ
              </Button>,
              <Button key="buy">Đặt vé khác</Button>,
              ]}
          />
      </Card>
    );
  }
  return (
    
    <>
      {resultContainer()}
    </>
  )
}

export default PaymentResult