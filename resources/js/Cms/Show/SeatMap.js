import { Affix, Avatar, Button, Card, Col, Divider, InputNumber, Row, Popover , Spin, Table, Tag } from 'antd'
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context.js'; 
import helper from '../../Client/Helper/helper.js';
import { useParams } from 'react-router';

const SeatMap = ({showId}) => {
  const [rowSeat, setRowSeat] = useState([]);
  const { getSeatMap } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  useEffect(()=> {
    if(showId) {
      setLoadingTable(true);
      const formData = new FormData();
      formData.append("show_id", showId)
      formData.append("cinema_hall_id", 2);
  
      var numberRow = 0;
      getSeatMap(formData).then(function (res) {
        setData(res.data.data);
        numberRow = res.data.data.length;
  
        var rowDefault = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        if(numberRow != null) {
            setRowSeat((rowDefault.slice(0, numberRow)).reverse());
        }
        setLoadingTable(false);
      });
    }
   
  }, [showId])

  const renderSeat = () => {
    var seatMaps = data.map((ele) =>
      <Row gutter={2} justify="center" wrap={false} key={ele.row} >
          {
            ele.seat.map((item) => (
            <Col key={item.seat_id}  style={{padding: '5px'}}>
             {
              item.status == 0?  <Button className='seat' >{item.number}</Button> :
                <Button className='seat' type="primary" danger>{item.number}</Button>
             }
            </Col>))
          }
      </Row>
    );
    return (
      <>
        {seatMaps}
      </>
    );
  }

  return (
      
    <Card title="Seat map" style={{height: '100%', marginTop: '20px'}}>
      <Spin spinning={loadingTable} tip='Loading...'>
      <div className='select-seat'>
        <Row gutter={[10, 5]} justify="center" style={{width: '80%'}}>
          <Col span={2} >
            {rowSeat.map((row, index) => {
              return <Row key={row + "-left"}  style={{padding: '5px'}} justify="start"><Button  style={{width: '40px'}}>{row}</Button></Row>
            })}
           
          </Col>
          <Col span={20}>
            {renderSeat()}
          </Col>
          <Col span={2}>
            {rowSeat.map((row, index) => {
              return <Row key={row + "-right"} style={{padding: '5px'}} justify="end"><Button  style={{width: '40px'}}>{row}</Button></Row>
            })}
          </Col>
            
        </Row>

        <Row justify='center' style={{width: '100%'}}>
          <Col span={8} offset={8} className="screen">Màn hình</Col>
        </Row>
        <Row justify='center' style={{width: '100%'}}>
          <Col span={8} className="Note" >
            <Row justify='space-between' style={{width: '100%'}}>
              <Col className='container-seat'><div className='seat-type'></div> Ghế có sẵn</Col>
              <Col className='container-seat'><div className='seat-type booking'></div>Ghế đã được đặt</Col>
              <Col className='container-seat'><div className='seat-type chossing'></div> Ghế đang chọn</Col>
            </Row>
          </Col>
        </Row>
      </div>
      </Spin>
    </Card>
        
  )
}

export default SeatMap