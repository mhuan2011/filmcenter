import { Avatar, Card, Col, InputNumber, Row, Space, Spin, Table, Tag } from 'antd'
import Meta from 'antd/lib/card/Meta.js';
import { record } from 'laravel-mix/src/HotReloading.js';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../Context.js';

const SelectTicket = () => {
  const [dataSource, setDataSource] = useState([]);
  
  useEffect(() => {
    setDataSource(data);
  },[])

  var data = [
    {
      type_id: 1,
      ticket_type: 'Nguoi Lon',
      quantity: 0,
      price: 50000,
      total: 0,
      description: 'Vé 2D'
    },
    {
      type_id: 2,
      ticket_type: 'Ve 2D Thanh Vien',
      quantity: 0,
      price: 50000,
      total: 0,
      description: 'Vé 2D-Chỉ áp dụng khách hàng thành viên'
    },
  ];

  const updateData = (dataSource) => {
    setDataSource(dataSource);
    console.log("huan",dataSource);
  }

  const columns = [
      {
        title: 'Loại vé',
        dataIndex: 'ticket_type',
        key: 'ticket_type',
        render: (_,record) => 
          <>
            <Meta
              title= {record.ticket_type}
              description = {record.description}
            />
          </>
        ,
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
        render: (_, record) => {
          const onChangeQuantity = (e) => {
            record.quantity = e;
            record.total = e * record.price;
            updateData(dataSource);
          }
            return (
            <>
              <InputNumber defaultValue={0} min={0} onChange={onChangeQuantity} />
            </>
          )
        },
      },
      {
        title: 'Giá (VNĐ)',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Tổng (VNĐ)',
        key: 'total',
        dataIndex: 'total',
      }
    ];
  
  return (
      
      <Row gutter={10} style={{padding: 10}}>
        <Col span={18}>
          <Card title="Chọn vé" style={{height: '100%'}}>
            <Table columns={columns} dataSource={[...dataSource]} pagination={false} rowKey="Id"/>
          </Card>
        </Col>
        <Col span={6} >
          <Card >
            <Card
              style={{ width: '100%' }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
            >
              <Meta
                  title="Card title"
                  description="This is the description"
              />
            </Card>
          </Card>
        </Col>
      </Row>
  )
}

export default SelectTicket