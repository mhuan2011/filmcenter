import { Avatar, Badge, Button, Col, Drawer, Dropdown, Empty, Layout, Menu, Row } from 'antd';
import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { UserOutlined, DownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { AppContext } from '../Context.js';
import Home from './Home.js';
import logo from '../../images/logo.png'

const { Header, Content, Footer } = Layout;

const Client = () => {
  return (
    <>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: 'rgba(250,250,250,0.8)' }}>
          <Row justify='space-between'>
              <Col span={8} >
                  <div className="logo">
                    <Link to='/'><img src={logo} alt=""/></Link>
                  </div>
              </Col>
              <Col  >
                  <Menu style={{ background: 'rgba(250,250,250,0)', float: 'right'}} mode="horizontal" defaultSelectedKeys={['home']} className="menu">
                    <Menu.Item key="home" className='nav-link active'>
                      <Link to='/'>Trang chủ</Link>
                    </Menu.Item>
                    <Menu.Item key="menu" className='nav-link'>
                      <Link to='/menu' >Phim</Link>
                    </Menu.Item>
                    <Menu.Item key="booking" className='nav-link'>
                      <Link to='/booking'>Đặt vé</Link>
                    </Menu.Item>
                    <Menu.Item key="about" className='nav-link'>
                      <Link to='/about-us'>Giới thiệu</Link>
                    </Menu.Item>
                  </Menu>
              </Col>
          </Row>
          
          
        </Header>

        <Content style={{ marginTop: '63px' }}>
          <Outlet />  
        </Content>

        <Footer style={{ textAlign: 'center' }}>FILM CENTER</Footer>

      </Layout>
    </>
  )
}

export default Client