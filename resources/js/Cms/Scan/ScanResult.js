import { DeleteOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Descriptions, Divider, Image, Popconfirm, Row, Space, Table, Typography  } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import {ReactToPrint, useReactToPrint } from 'react-to-print';
import { QrReader } from 'react-qr-reader';

import { AppContext } from '../../Context'; 

import Barcode from 'react-barcode';
import {TicketList} from './TicketList';
import TicketListR from './TicketListR';
const { Paragraph, Text } = Typography;
const ScanResult = ({user, show, seat}) => {
    const [listTicket, setListTicket] = useState();
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true
    });
    useEffect(() => {
        const list = 
        (
            seat.map((item, index) => (
                <Col key={index}>
                    <div className="cardWrap" >
                    <div className="card cardLeft">
                        <h1 className="title-ticket">Filmcenter <span>Cinema</span></h1>
                        <div className="title">
                            <h2>{show.movies_title}</h2>
                            <span>movie</span>
                        </div>
                        <div className="name">
                            <h2>{user.name}</h2>
                            <span>name</span>
                        </div>
                        <div className="seat">
                            <h2>{item.row + item.number}</h2>
                            <span>seat</span>
                        </div>
                        <div className="time">
                            <h2>{show.start_time ? (show.start_time).substring(0, 5) : ""}</h2>
                            <span>time</span>
                        </div>
                        <div className="time">
                            <h2>{show.date}</h2>
                            <span>date</span>
                        </div>
                        <div className="time">
                            <h2>{show.date}</h2>
                            <span>date</span>
                        </div>
                    </div>
                    <div className="card cardRight">
                        <div className="eye"></div>
                        <div className="number">
                            <h3>{item.row + item.number}</h3>
                            <span>seat</span>
                        </div>
                        <div className="barcode">
                            <Barcode value={`FCT-${item.row + item.number}-${item.id}`} />;
                        </div>
                    </div>
                    </div>
                </Col>
            ))
        )
        
        setListTicket (
            list
        )
    }, [seat])
  
  return (
    <>

        <Divider orientation="left" orientationMargin="0">
            Thông tin khách hàng:
        </Divider>
        <Descriptions>
            <Descriptions.Item label="Tên:">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left" orientationMargin="0">
            Thông tin đặt vé:
        </Divider>
        <Descriptions
            bordered
            // title="Thông tin đặt vé"
            // size={size}
            // extra={<Button type="primary">Edit</Button>}
        >
            <Descriptions.Item label="Phim">{show.movies_title}</Descriptions.Item>
            <Descriptions.Item label="Ngày chiếu">{show.date}</Descriptions.Item>
            <Descriptions.Item label="Suất chiếu">{show.start_time}</Descriptions.Item>
            <Descriptions.Item label="Rạp">{show.cinema_name}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
                {show.cinema_address}
            </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left" orientationMargin="0" extra={<Button>Print</Button>}>
            Ticket list:
        </Divider>
        {/* <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return <a href="#">Print this out!</a>;
          }}
          content={() => <TicketList seat={seat} show={show} user={user}/>}
        /> */}
        <Row gutter={[16,16]} ref={componentRef}>
                <TicketList seat={seat} user={user} show={show} />
        </Row>
        <Row gutter={[16,16]}>
                {/* <TicketListR seat={seat} show={show} user={user}/>   */}
        </Row>
        <Button onClick={handlePrint } style={{marginTop: '10px'}} icon={<PrinterOutlined />} type='primary'>Print</Button>  
    
        
            
        
    </>
  )
}

export default ScanResult