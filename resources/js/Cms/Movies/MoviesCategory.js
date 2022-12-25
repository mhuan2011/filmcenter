import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';
import ActCategory from './ActCateogry';

const MoviesCategory = () => {
  let navigate = useNavigate();
  const { getListCategory, deleteCategory } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [visible, setvisible] = useState(false);
  const [refresh, setRefresh] = useState(null);
  const [keyID, setKeyID] = useState(null);


  useEffect(() => {
    getListCategory().then((response) => {
      setData(response.data.data);
      setLoadingTable(false)
    }).catch((err) => {
      openNotification({ status: false, message: err.response.data.message });
      setLoadingTable(false)
    })
  }, [refresh])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 100,
    // },
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
    setKeyID(record.id);
    setvisible(true);
  }
  const remove = (record) => {
    setLoadingTable(true)
    deleteCategory(record.id).then((res) => {
      if (res.data.status) {
        let newItems = data.filter(item => item.id !== record.id)
        setData(newItems)
        setRefresh(new Date());
        openNotification(res.data);
      } else {
        openNotification({ status: false, data: res.data.message });
      }
      setLoadingTable(false)
    })
  }
  const openDraw = () => {
    setvisible(true);
  }
  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý phim</Breadcrumb.Item>
        <Breadcrumb.Item>Thể loại</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Button type='primary' style={{ marginBottom: '16px' }} onClick={() => openDraw()}>Thêm thể loại</Button>
        <Table
          bordered
          scroll={{ x: 980 }}
          columns={columns}
          dataSource={data}
          rowKey='id'
          loading={loadingTable}
        />
      </div>
      <ActCategory visible={visible} setDraw={setvisible} keyID={keyID} refresh={setRefresh} setKey={setKeyID} />

    </>
  )
}

export default MoviesCategory