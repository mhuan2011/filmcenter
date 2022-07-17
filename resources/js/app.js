import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Provider from './Context';
import 'antd/dist/antd.css';
import '../css/app.css';
import { AppContext } from './Context';
//
import Client from './Client/Client';
import Home from './Client/Home';
import Category from './Client/Category';


function App() {
    function PrivateOutlet() {
        // const { user } = useContext(AppContext);
        // const auth = user.role_id ? user.role_id : false;
        // return auth ? <Cms/> : <Navigate to="/" />;
      }
    return (
        <div className='App'>
          <Routes>
              <Route path='/' element={<Client />}>
                  <Route index element={<Home />} />
                  <Route path='/category' element={<Category />} />
              </Route>
              <Route path='/admin' element={<PrivateOutlet />}>
              
              </Route>
          </Routes>
        </div>
    );
}

ReactDOM.render(
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('app')
)