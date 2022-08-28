import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Image, Popconfirm, Space, Table, Typography  } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification'; 
import { AppContext } from '../../Context'; 
const { Paragraph, Text } = Typography;
const MoviesList = () => {
  let navigate = useNavigate();
  const { getFilterCategory, getListMovies } = useContext(AppContext);
  const [data, setData] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [categories, setCategories] = useState([])
  const [ellipsis, setEllipsis] = useState(true);

  useEffect(() => {
    getFilterCategory().then((res) => {
      setCategories(res.data.data);
      console.log(res.data.data)
    });
    getListMovies ().then((res) => {
      setData(res.data.data);
      setLoadingTable(false)
    });
    
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
        title: 'Ảnh',
        dataIndex: 'image',
        key: 'image',
        width: 130,
        render: image => {
          return (
            <Image
              width={'100%'}
              src={APP_URL + '/images/movies' + image}
            />
          )
        }
      },
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
      width: 300,
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
      width: 150,
      render: (duration) => (
        <>{duration * 60}</>
      )
    },
    {
      title: 'Ngày ra mắt',
      dataIndex: 'release_date',
      key: 'release_date',
      width: 120,
      render: (time) => (
        <>
          {moment(time).format('DD/MM/YYYY')}
        </>
      )
    },
    {
        title: 'Thể loại',
        key: 'category_id',
        dataIndex: 'category_id',
        width: 120,
        filters: categories,
        onFilter: (value, record) => record.category_id == value,
        render: (_, record) => {
          return <>{record.category.name}</>
        }
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        render: (description) => {
          return (
            <Paragraph
            ellipsis={
              ellipsis
                ? {
                    rows: 2,
                    expandable: true,
                    symbol: 'more',
                  }
                : false
            }
          >
            {description}
          </Paragraph>
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
          <Popconfirm title="Xóa món này?" placement="leftTop" onConfirm={() => remove(record)}>
            <Button type="link" size="small" danger><DeleteOutlined /></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const update = (record) => {
    navigate(`/admin/movies/detail/${record.id}`)
  }
  const remove = (record) => {
    setLoadingTable(true)
    deleteMenu(record.id).then((res) => {
      let newItems = data.filter(item => item.id !== record.id)
      setData(newItems)
      openNotification(res.data);
      setLoadingTable(false)
    })
  }
  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Quản lý phim</Breadcrumb.Item>
        <Breadcrumb.Item>Danh sách</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
        <Button type='primary' style={{ marginBottom: '16px' }}><Link to="/admin/movies/detail?action=add">Thêm phim</Link></Button>
        <Table
          bordered
          scroll={{ x: 980 }}
          columns={columns}
          dataSource={data}
          rowKey='id'
          loading={loadingTable}
        />
      </div>
    </>
  )
}

export default MoviesList