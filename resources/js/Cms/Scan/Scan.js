import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Empty, Image, Popconfirm, Row, Space, Spin, Table, Typography  } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import { AppContext } from '../../Context'; 

import { QrReader } from 'react-qr-reader';
import ScanResult from './ScanResult';
import useSound from 'use-sound';

// import beep from '../../../sounds/beep.mp3';


const { Paragraph, Text } = Typography;
const Scan = () => {
  let navigate = useNavigate();
  const { getInforReservation } = useContext(AppContext);
  const [data, setData] = useState('No result');
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});
  const [show, setShow] = useState({});
  const [seat, setSeat] = useState([]);

  // const [play] = useSound(beep);

  useEffect(() => {
    if(data != "No result") {
        // play
        setLoading(true);
        getInforReservation(data).then((res) => {
          if(res.data.status == true) {
            setUser(res.data.data.user[0]);
            setShow(res.data.data.show_infor[0]);
            setSeat(res.data.data.seat);
            openNotification(res.data);
          }else {
            openNotification(res.data);
            setUser({});
            setShow({});
            setSeat([]);
          }
          setLoading(false);
          
        })
    }
    
  }, [data])
  
  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý phim</Breadcrumb.Item>
        <Breadcrumb.Item>Scan QR code</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 380 }}>
        <Row >
            <Col span={16} style={{ paddingRight: '16px' }}>
              <Spin spinning={loading}>
                { user.name ? <ScanResult user={user} show={show} seat={seat}/> : <>
                <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                      height: 100,
                    }}
                    style={{height: '100%'}}
                    description={
                      <span>
                        Không có dữ liệu
                      </span>
                    }
                  >
                  </Empty>
                </>}
              </Spin> 
            </Col>
            <Col span={8}>

             <Card  title="Scann QR code here" className='scan-qr'>
              <p style={{textAlign: "center"}}>Order ID:<strong> {data}</strong></p>
              <QrReader
                      onResult={(result, error) => {
                        if (!!result) {
                            setData(result?.text);
                        }

                        // if (!!error) {
                        //     console.info(error);
                        // }
                      }}
                      style={{ width: '200px' }}
                  />
                 <div className='around'>
                      <p className='title-scan'>SCAN HERE</p>
                      <p className='author-scan'>HUAN DEV</p>
                 </div>
              </Card>
            </Col>
        </Row>
      </div>
    </>
  )
}

export default Scan