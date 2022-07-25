import { Avatar, Badge, Button, Col, Drawer, Dropdown, Empty, Layout, Menu, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { UserOutlined, DownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { AppContext } from '../Context.js';
import Home from './Home.js';
import logo from '../../images/logo.png'

const { Header, Content, Footer } = Layout;

const Client = () => {
  const { user } = useContext(AppContext);
  
  const [selected, setSelected] = useState('');
  useEffect(() => {
    var path = window.location.pathname;
    if(path != null && path != "") {
      setSelected(path.substring(1, path.length));
    } else {
      setSelected('home')
    };
    
  },[])

  const menuItems = [
    {
      key: 'home',
      label: <Link to='/'>Trang chủ</Link>,
    },
    {
      key: 'menu',
      label: <Link to='/menu'>Phim</Link>,
    },
    {
      key: 'ticket',
      label: <Link to='/ticket'>Mua vé</Link>,
    },
    {
      key: 'about-us',
      label: <Link to='/about-us'>Giới thiệu</Link>,
    },

  ];


  const dropDownItem = [
    {
      key: '1',
      label: <Link to='/me'>Thông tin cá nhân</Link>,
    },
    {
      key: '2',
      label: <Link to='/history'>Lịch sử đặt vé</Link>,
    },
    {
      key: '3',
      label: <Link to='/logout'>Đăng xuất</Link>,
    },
  ]
  const menu = (
    <Menu items={dropDownItem} >
    </Menu>
  );

  const onClick = (e) => {
    setSelected(e.key);
  };

  return (
    <>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header style={{ position: 'fixed', zIndex: 100, width: '100%', background: 'rgba(250,250,250,1)' }}>
          <Row justify='space-between'>
              <Col span={8} >
                  <div className="logo">
                    <Link to='/'><img src={logo} alt=""/></Link>
                  </div>
              </Col>
              <Col >
                  <Row>
                    <Col>
                      <Menu 
                        style={{ background: 'rgba(250,250,250, 0)', float: 'right' }} 
                        onClick={onClick} 
                        items={menuItems} 
                        mode="horizontal"  
                        selectedKeys={selected} 
                        className="menu"
                      />
                    </Col>
                    <Col>
                      {!user.id
                        ? <Button type='primary'><Link to='/login'>Đăng nhập</Link></Button>
                        : <>
                          {user.name}
                          <Dropdown overlay={menu} trigger={['click']}>
                            <Avatar icon={<UserOutlined />} /> 
                          </Dropdown>
                      </>}
                    </Col>
                  </Row>
              </Col>
             
          </Row>
          
          
        </Header>

        <Content style={{ marginTop: '63px' }}>
          <Outlet />  
        </Content>

        <Footer style={{ textAlign: 'center', zIndex: 10 }}>FILM CENTER</Footer>

      </Layout>
    </>
  )
}

export default Client