import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Descriptions, Divider, Image, Popconfirm, Row, Space, Table, Typography  } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import ReactToPrint from 'react-to-print';
import { QrReader } from 'react-qr-reader';

import { AppContext } from '../../Context'; 

import Barcode from 'react-barcode';
const { Paragraph, Text } = Typography;



export class TicketList extends React.PureComponent {

    constructor (props) {
        super(props)
        this.state = {
          seat:  this.props.seat,
          user: this.props.user,
          show: this.props.show
        }
     }


    render() {
        const { seat, user,  show} = this.state;
        console.log("huan", this.props.seat);
      return (
        <>
    {
        this.props.seat.map((item, index) => (
                <Col key={index}>
                    <div className="cardWrap" >
                    <div className="card cardLeft">
                        <h1 className="title-ticket">Filmcenter <span>Cinema</span></h1>
                        <div className="title">
                            <h2>{this.props.show ? this.props.show.movies_title: ""}</h2>
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
                            <h2>{this.props.show.start_time ? (this.props.show.start_time).substring(0, 5) : ""}</h2>
                            <span>time</span>
                        </div>
                        <div className="time">
                            <h2>{this.props.show.date}</h2>
                            <span>date</span>
                        </div>
                        <div className="time">
                            <h2>{this.props.show.screen}</h2>
                            <span>Screen</span>
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
    }
    </>
      );
    }
}


// const TicketList = ({show, user, seat}) => {

    
//   return (
//     <>
//     {
//         seat.map((item, index) => (
//                 <Col key={index}>
//                     <div className="cardWrap" >
//                     <div className="card cardLeft">
//                         <h1 className="title-ticket">Filmcenter <span>Cinema</span></h1>
//                         <div className="title">
//                             <h2>{show ? show.movies_title: ""}</h2>
//                             <span>movie</span>
//                         </div>
//                         <div className="name">
//                             <h2>{user.name}</h2>
//                             <span>name</span>
//                         </div>
//                         <div className="seat">
//                             <h2>{item.row + item.number}</h2>
//                             <span>seat</span>
//                         </div>
//                         <div className="time">
//                             <h2>{show.start_time ? (show.start_time).substring(0, 5) : ""}</h2>
//                             <span>time</span>
//                         </div>
//                         <div className="time">
//                             <h2>{show.date}</h2>
//                             <span>date</span>
//                         </div>
//                         <div className="time">
//                             <h2>{show.date}</h2>
//                             <span>date</span>
//                         </div>
//                     </div>
//                     <div className="card cardRight">
//                         <div className="eye"></div>
//                         <div className="number">
//                             <h3>{item.row + item.number}</h3>
//                             <span>seat</span>
//                         </div>
//                         <div className="barcode">
//                             <Barcode value={`FCT-${item.row + item.number}-${item.id}`} />;
//                         </div>
//                     </div>
//                     </div>
//                 </Col>
//             ))
//     }
//     </>
//   )
// }

// export default TicketList 