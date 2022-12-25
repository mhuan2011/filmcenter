import {
  BarcodeOutlined,
  BellOutlined,
  DesktopOutlined, DownOutlined, HomeOutlined, ProfileOutlined, ShopOutlined, UserOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Layout, List, Menu, Popover } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppContext } from '../Context';
import FooterCms from './Layout/FooterCms';
import HeaderCms from './Layout/HeaderCms';

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu;







const Cms = () => {
  const { user } = useContext(AppContext);
  const [storeName, setStoreName] = useState("");
  const [keyActive, setKeyActive] = useState("");
  const [openMenu, setOpenMenu] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    var splitUrl = window.location.href.split("/");
    var key = splitUrl[4];
    if (key) {
      setKeyActive(key);
      var subkey = getSubkey(key);
      setOpenMenu([subkey])
    }
  }, [])


  function getSubkey(key) {
    var menus = ['category', 'person', 'movies'];
    var ticket = ['show', 'scan'];
    var cinema = ['cinema-hall', 'cinema'];
    var user = ['users', 'roles', 'permission'];

    var result = "";
    menus.forEach(ele => {
      if (ele == key) {
        result = 'menus';
      }
    });

    ticket.forEach(ele => {
      if (ele == key) {
        result = 'ticket';
      }
    });

    cinema.forEach(ele => {
      if (ele == key) {
        result = 'cinema-manager';
      }
    });

    user.forEach(ele => {
      if (ele == key) {
        result = 'user';
      }
    });
    return result;
  }

  const onClick = (e) => {
    setKeyActive(e.key);
  };

  const onOpenChange = (key) => {
    setOpenMenu(key)
  }



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="md"
        collapsedWidth="0"
      >
        <div className="logo-admin" >CMS Filmcenter</div>

        <Menu
          mode="inline"
          onClick={onClick}
          selectedKeys={[keyActive]}
          openKeys={openMenu}
          onOpenChange={onOpenChange}
          theme={theme}
        >


          <Menu.Item key="0" icon={<DesktopOutlined />}>
            <Link to="/admin">CMS</Link>
          </Menu.Item>
          <SubMenu
            key="client"
            icon={<DesktopOutlined />}
            title="Client"
          >
            <Menu.Item key="client-1">
              <Link to="/admin/client/banner">Banner</Link>
            </Menu.Item>
          </SubMenu>
          {(user.role_id == 1 || user.role_id == 2) ? <SubMenu
            key="menus"
            icon={<VideoCameraOutlined />}
            title="Quản lý phim"

          >
            <Menu.Item key="category">
              <Link to="/admin/category">Thể loại</Link>
            </Menu.Item>
            <Menu.Item key="person">
              <Link to="/admin/person">Đạo diễn/ diễn viên</Link>
            </Menu.Item>
            <Menu.Item key="movies">
              <Link to="/admin/movies">Danh sách phim</Link>
            </Menu.Item>
          </SubMenu> : null}

          <SubMenu
            key="ticket"
            icon={<BarcodeOutlined />}
            title="Quản lý vé"
          >
            <Menu.Item key="show">
              <Link to="/admin/show">Lịch chiếu</Link>
            </Menu.Item>
            <Menu.Item key="scan">
              <Link to="/admin/scan">Quét mã</Link>
            </Menu.Item>
          </SubMenu>

          {user.role_id == 1 || user.role_id == 2 ? <SubMenu
            key="cinema-manager"
            icon={<ShopOutlined />}
            title="Quản lý rạp"
          >
            <Menu.Item key="cinema-hall">
              <Link to="/admin/cinema-hall">Danh phòng chiếu</Link>
            </Menu.Item>
            <Menu.Item key="cinema">
              <Link to="/admin/cinema">Danh sách rạp</Link>
            </Menu.Item>
          </SubMenu> : null}

          {user.role_id == 1 && <>
            <SubMenu
              key="report-builder"
              icon={<ProfileOutlined />}
              title="Report"
            >
              <Menu.Item key="report">
                <Link to="/admin/report">Báo cáo chi tiết</Link>
              </Menu.Item>
            </SubMenu>
          </>}


          {user.role_id == 1 ? <SubMenu
            key="user"
            icon={<UserOutlined />}
            title="User"
          >
            <Menu.Item key="users">
              <Link to="/admin/users">Quản lý tài khoản</Link>
            </Menu.Item>
            <Menu.Item key="roles">
              <Link to="/admin/roles">Role</Link>
            </Menu.Item>
            <Menu.Item key="permission">
              <Link to="/admin/permission">Permission</Link>
            </Menu.Item>
          </SubMenu> : null}

        </Menu>
      </Sider>
      <Layout>
        <HeaderCms storeName={storeName} user={user} theme={theme} setTheme={setTheme} />
        <Content style={{ margin: '16px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 160 }}>
            <Outlet />
          </div>
        </Content>
        <FooterCms />
      </Layout>
    </Layout>
  )
}

export default Cms