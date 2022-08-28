import { Affix, Avatar, Button, Card, Col, Divider, InputNumber, Row, Space, Spin, Table, Tag, Tooltip } from 'antd'
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../Context.js';
import helper from '../../Helper/helper.js';

const SeatMap = ({ticketInfor, setTicketInfor, total, setSeat}) => {
  const [rowSeat, setRowSeat] = useState([]);
  const { getSeatMap } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [stateSeat, seatStateSeat] = useState([]);

  const [reserved , setReserved] = useState([]);
  const [totalSeat , setTotalSeat] = useState(null);

  useEffect(()=> {
    const queryParams = new URLSearchParams(window.location.search);
    const showId = queryParams.get('showId');
    if(showId) {

      var totalS = 0;
      ticketInfor.ticketType.map(item => {
        totalS += item.quantity;
      } );
      setTotalSeat(totalS);

      setLoadingTable(true);
      const formData = new FormData();
      formData.append("show_id", showId)
      formData.append("cinema_hall_id", 2);
  
      var numberRow = 0;
      getSeatMap(formData).then(function (res) {
        setData(res.data.data);
        numberRow = res.data.data.length;
        getStatusSeat(res.data.data);
        var rowDefault = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        if(numberRow != null) {
            setRowSeat((rowDefault.slice(0, numberRow)).reverse());
        }
        //
        setLoadingTable(false);
      });
    }
   
  }, [])

  useEffect(() => {
    ticketInfor.reserveSeat = reserved;
    setTicketInfor(ticketInfor);
    setSeat(reserved);
  },[reserved])

  const getStatusSeat = (dataSeat) => {
    var status = [];
    dataSeat.map(row => {
      row.seat.map( col => {
        status.push(col.status);
      });
    });

    seatStateSeat(status);
  }

  const getSeat = (item, row, rowChart) => {
    let dataTemp = data;
    dataTemp[row].seat[item.number-1  ].status = 2;
    var tempReserve = reserved;

    if(tempReserve.length == totalSeat) {
      var removeSeat = tempReserve.shift();
      dataTemp[removeSeat.row].seat[removeSeat.seat.number-1  ].status = 0;
      tempReserve.push()
    }

    

    setReserved([...tempReserve, {
      row: row,
      rowChart: rowChart,
      seat: dataTemp[row].seat[item.number-1 ]
    }]);
    setData([...dataTemp]);
  }


  const removeSelect = (item, row, rowChart) => {
    let dataTemp = data;
    
    var tempReserve = reserved;
    
    console.log("first", tempReserve);
    tempReserve.forEach((element, index) => {
      if(item.seat_id == element.seat.seat_id) {
        dataTemp[row].seat[item.number-1  ].status = 0;
        tempReserve.splice(index, 1);
      }
      
    });
    setReserved([...tempReserve]);
    setData([...dataTemp]);
  }
  
  const renderSeat = () => {
    var seatMaps = data.map((ele, index) =>
      <Row gutter={2} justify="center" wrap={false} key={ele.row} >
          {
            ele.seat.map((item) => (
            <Col key={item.seat_id}  style={{padding: '5px'}}>
             {
              item.status == 0?  <Button className='seat' onClick={(() => getSeat(item, index, ele.row))}  >{item.number}</Button> :
              item.status == 2?  <Button className='seat' onClick={(() => removeSelect(item, index, ele.row))} type="primary" >{item.number}</Button>
              : <Tooltip placement="bottom" title='Ghế đã được chọn'> <Button className='seat'  type="primary" danger>{item.number}</Button> </Tooltip> 
              
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
      
    <Card title="Chọn ghế" style={{height: '100%', margin: 10}}>
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
          <Col span={12} className="Note" >
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