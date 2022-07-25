import { Affix, Avatar, Card, Col, Divider, InputNumber, Row, Space, Spin, Table, Tag } from 'antd'
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../Context.js';
import helper from '../../Helper/helper.js';

const Combo = ({ticketInfor, setTicketInfor, setTotal}) => {
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

  const updateData = () => {
    var totalPrice = 0;
    var ticketType = [];

    dataSource.forEach(ele => {
      totalPrice += ele.quantity * ele.price;
      if(ele.quantity > 0) {
        ticketType.push(ele);
      }
    });
    setTotal(totalPrice);
    // 
    ticketInfor.ticketType = ticketInfor;
    setTicketInfor(ticketInfor);
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
        render: (text, record, index) => {
          const onChangeQuantity = (e) => {
            if (e != null) {
              record.quantity = e;
              setDataSource(
                dataSource.map((row, i) =>
                  i === index ? { ...record, total: record.quantity*record.price } : row
                )
              );
            }     
            updateData();
          }
            return (
            <>
              <InputNumber defaultValue={0} min={0} max={10} onChange={onChangeQuantity}
              />
            </>
          )
        },
      },
      {
        title: 'Giá (VNĐ)',
        dataIndex: 'price',
        key: 'price',
        render: (price) => (
          <>{helper.formatCurrency(price)}</>
        )
      },
      {
        title: 'Tổng (VNĐ)',
        key: 'total',
        dataIndex: 'total',
        render: (total) => (
          <>{helper.formatCurrency(total)}</>
        )
      }
    ];
  
  return (

      <Card title="Chọn combo" style={{height: '100%', margin: 10}}>
        <Table columns={columns} dataSource={[...dataSource]} pagination={false} rowKey={(record) => {return(record.type_id)}}/>
      </Card>
  
  )
}

export default Combo