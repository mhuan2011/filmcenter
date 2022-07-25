import { Spin } from 'antd';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from './Context'; 

const Logout = () => {
  const { setUser } = useContext(AppContext);
  let navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("user");
    setUser({ role_id: null });
    navigate("/");
  }, [])

  return (
    <div style={{ marginTop: '16px', textAlign: 'center' }}>
      <Spin tip="Loading..."></Spin>
    </div>
  )
}

export default Logout