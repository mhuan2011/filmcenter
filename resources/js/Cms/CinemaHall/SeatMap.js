import { Affix, Avatar, Button, Card, Col, Divider, InputNumber, Row, Space, Spin, Table, Tag } from 'antd'
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context.js'; 
import helper from '../../Client/Helper/helper.js';

const SeatMap = ({totalSeat}) => {
  const [rowSeat, setRowSeat] = useState([]);


  useEffect(()=> {
    var rowDefault = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    if(totalSeat != null) {
        var numberRow = totalSeat/14;
        setRowSeat((rowDefault.slice(0, numberRow)).reverse());
    }

  }, [totalSeat])
  
  const renderSeat = () => {
    var seatList = []; var i = 1;
    while(i<15) {  seatList.push(i); i++; }

    var seatMaps = rowSeat.map((row) =>
      <Row gutter={2} justify="center" wrap={false} key={row} >
          {
            seatList.map((number) =>
            <Col key={row + '-' +number}  style={{padding: '5px'}}><Button className='seat' >{number}</Button></Col>)
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
      </div>
    </Card>
        
  )
}

export default SeatMap