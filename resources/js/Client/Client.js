import { Avatar, Badge, Button, Col, Drawer, Dropdown, Empty, Form, Layout, List, Menu, Popover, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { UserOutlined, DownOutlined, ShoppingCartOutlined, MailOutlined, AppstoreOutlined, SettingOutlined, MenuOutlined, BellOutlined } from '@ant-design/icons';
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
      label: <Link to='/movies'>Phim</Link>,
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
  const menu =() => {
    if((user.role_id == 1 || user.role_id == 2) && dropDownItem.length == 3) {
      dropDownItem.push(
        {
          key: '4',
          label: <Link to='/admin'>CMS</Link>,
        },
      )
    }
    return (
      <Menu items={dropDownItem} >
      </Menu>
    )
  };

  const onClick = (e) => {
    setSelected(e.key);
  };

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

  const notice = () => {
    return (
      <List
        size="small"
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    )
  }
  
  return (
    <>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header style={{ position: 'fixed', zIndex: 100, width: '100%', background: 'rgba(250,250,250,1)' }}>
          <div className='header-container'>
            <div className="logo">
                {/* <Link to='/'><img src={logo} alt=""/></Link> */}
                <Link to='/'><div className="text-logo">Fimcenter</div></Link>
            </div>
            <div className='nav-bar'>
              <Menu 
                      onClick={onClick} 
                      items={menuItems} 
                      mode="horizontal"   
                      selectedKeys={selected} 
                      overflowedIndicator ={<MenuOutlined/>}
                      className="menu"
              />
                {!user.id
                        ? <Button type='primary'><Link to='/login'>Đăng nhập</Link></Button>
                        : <>
                          {user.name}
                          <Dropdown overlay={menu} trigger={['click']}>
                            <Avatar style={{marginLeft: '4px'}} icon={<UserOutlined />} /> 
                          </Dropdown>
                          <Popover placement="bottomRight" title={"Thông báo"} content={notice} trigger="click" style={{width: 300}}>
                             <Badge  count={1}>
                              <Avatar style={{marginLeft: '10px'}} icon={<BellOutlined />} />
                            </Badge>
                          </Popover>
                      </>}
            </div>
          </div>
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