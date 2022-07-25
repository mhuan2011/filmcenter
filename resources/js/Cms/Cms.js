import {
  DesktopOutlined, DownOutlined, HomeOutlined, ProfileOutlined, UserOutlined
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppContext } from '../Context'; 

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu;



const dropDownItem = [
  {
    key: '1',
    label: <Link to='/'>Trở lại trang chủ</Link>,
  },
  {
    key: '2',
    label: <Link to='/me'>Thông tin cá nhân</Link>,
  },
  {
    key: '3',
    label: <Link to='/my-order'>Thông tin đơn hàng</Link>,
  },
  {
    key: '4',
    label: <Link to='/logout'>Đăng xuất</Link>,
  },
]

const menu = (
  <Menu items={dropDownItem} >
  </Menu>
);

const Cms = () => {
  const { user } = useContext(AppContext);
  const [ storeName, setStoreName ] = useState("");
  useEffect(() => {
    console.log("user", user);
  },[])
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="md"
        collapsedWidth="0"
      >
        <div className="logo-admin" />

        <Menu mode="inline" defaultSelectedKeys={['0']} defaultOpenKeys={['menus', 'sub1']}>
          <Menu.Item key="0" icon={<DesktopOutlined />}>
            <Link to="/admin">CMS</Link>
          </Menu.Item>
          {user.role_id < 3 ? <SubMenu
            key="menus"
            icon={<ProfileOutlined />}
            title="Quản lý phim"
            
          >
            <Menu.Item key="menus-1">
              <Link to="/admin/category">Thể loại</Link>
            </Menu.Item>
            <Menu.Item key="menus-2">
              <Link to="/admin/person">Đạo diễn/ diễn viên</Link>
            </Menu.Item>
            <Menu.Item key="menus-3">
              <Link to="/admin/movies">Danh sách phim</Link>
            </Menu.Item>
          </SubMenu> : null}
          <SubMenu
            key="sub1"
            icon={<ProfileOutlined />}
            title="Quản lý vé"
          >
            <Menu.Item key="sub1-1">
              <Link to="/admin/orders_store">Danh sách vé</Link>
            </Menu.Item>
          </SubMenu>
          {user.role_id < 3 ? <Menu.Item key="7" icon={<UserOutlined />}>
            <Link to="/admin/users">Quản lý tài khoản</Link>
          </Menu.Item> : null}
          {user.role_id === 1 ? <Menu.Item key="8" icon={<HomeOutlined />}>
            <Link to="/admin/stores">Quản lý rạp</Link>
          </Menu.Item> : null}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff' }} >
          Chi nhánh: {storeName} {user.role_id==1?"Tất cả các rạp":""}
          <div className="login">
            <>
              <Avatar icon={<UserOutlined />} />
              {user.name}
              <Dropdown overlay={menu} trigger={['click']}>
                <DownOutlined />
              </Dropdown>
            </>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', zIndex: 10 }}>FILM CENTER</Footer>
      </Layout>
    </Layout>
  )
}

export default Cms