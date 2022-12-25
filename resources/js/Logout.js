import { Spin } from 'antd';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from './Context';
import { openNotification } from './Client/Helper/Notification';

const Logout = () => {
  const { setUser, logout } = useContext(AppContext);
  let navigate = useNavigate();
  useEffect(() => {
    logout().then((response) => {
      setUser({ role_id: null });

      localStorage.removeItem("user");
      openNotification(response.data);
    })
      .catch((error) => {
      });
    navigate("/");
  }, [])

  return (
    <div style={{ marginTop: '16px', textAlign: 'center' }}>
      <Spin tip="Loading..."></Spin>
    </div>
  )
}

export default Logout