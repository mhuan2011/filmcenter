import { DeleteOutlined, EditOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../../Client/Helper/Notification';
import { AppContext } from '../../../Context'; 
import ActPerson from './ActPerson';

const Person = () => {
  let navigate = useNavigate();
  const {getListPerson, deletePerson } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [visible, setvisible] = useState(false);
  const [refresh, setRefresh] = useState(null);
  const [keyID, setKeyID] = useState(null);
  

  useEffect(() => {
    getListPerson().then((response) => {
      setData(response.data.data);
      setLoadingTable(false)
    })
    
  }, [refresh])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'person_id',
      key: 'person_id',
      width: 50,
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 130,
      render: pic => {
        return (
          <Image
          width={100}
          src={APP_URL + '/images' + pic}
          />
        )
      }
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      width: 200,
      render: (date) => {
        return (
          <>{moment(date).format('YYYY/MM/DD')}</>
        )
      }
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender) => {
        return (
          <div style={{textAlign: 'center'}}>{gender ? <WomanOutlined style={{color: '#eb2f96', fontSize: '20px'}} /> : <ManOutlined  style={{color: '#52c41a', fontSize: '20px'}}  />}</div>
        )
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description) => {
        
        return (
          <div dangerouslySetInnerHTML={{__html: description}}></div>
        )
      }
    },
    
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => update(record)}><EditOutlined /></Button>
          <Popconfirm title="Xóa thể loại phim này?" placement="leftTop" onConfirm={() => remove(record)}>
            <Button type="link" size="small" danger><DeleteOutlined /></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const update = (record) => {
    navigate(`/admin/person/detail/${record.person_id}`)
  }
  const remove = (record) => {
    setLoadingTable(true)
    deletePerson(record.id).then((res) => {
      let newItems = data.filter(item => item.id !== record.id)
      setData(newItems)
      openNotification(res.data);
      setLoadingTable(false)
    })
  }
  const openDraw = () =>{
    setvisible(true);
}
  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý phim</Breadcrumb.Item>
        <Breadcrumb.Item>Đạo diễn - diễn viên</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Button type='primary' style={{ marginBottom: '16px' }} ><Link to="/admin/person/detail?action=add">Thêm nhân vật</Link></Button>
        <Table
          bordered
          scroll={{ x: 980 }}
          columns={columns}
          dataSource={data}
          rowKey='person_id'
          loading={loadingTable}
        />
      </div>

    </>
  )
}

export default Person