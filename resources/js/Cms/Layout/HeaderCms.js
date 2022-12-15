import { BellOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Layout, List, Menu, Popover, Switch } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';


const { Header, } = Layout


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
        label: <Link to='/logout'>Đăng xuất</Link>,
    },
]
const HeaderCms = ({ storeName, user, theme, setTheme }) => {
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

    const menu = (
        <Menu items={dropDownItem} >
        </Menu>
    );

    const changeMode = (value) => {
        setTheme(value ? 'dark' : 'light');
    }
    return (
        <>

            <Header style={{ background: '#fff' }} >
                {/* Chi nhánh: {storeName} {(user.role_id == 1 || user.role_id == 2) ? "Tất cả các rạp" : ""} */}
                <Switch checkedChildren="dark" unCheckedChildren="light" defaultChecked={false} onChange={changeMode} />
                <div className="login">
                    <>
                        {user.name}
                        <Dropdown overlay={menu} trigger={['hover']} arrow>
                            <Avatar style={{ marginLeft: '5px', marginRight: 0 }} icon={<UserOutlined />} />
                        </Dropdown>
                        <Popover placement="bottomRight" title={"Thông báo"} content={notice} trigger="click" style={{ width: 300 }}>
                            <Badge count={1}>
                                <Avatar style={{ marginLeft: '10px' }} icon={<BellOutlined />} />
                            </Badge>
                        </Popover>
                    </>
                </div>
            </Header>
        </>
    )
}

export default HeaderCms