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
import Ticket from './Client/Ticket/Ticket';
import BookTicket from './Client/Ticket/BookTicket';
import Login from './Client/Login';
import Register from './Client/Register';
import Logout from './Logout';
import Dashboard from './Cms/Dashboard';
import Cms from './Cms/Cms';
import MoviesList from './Cms/Movies/MoviesList';
import MoviesCategory from './Cms/Movies/MoviesCategory';
import Person from './Cms/Movies/Person/Person';
import ActPerson from './Cms/Movies/Person/ActPerson';


function App() {
    function PrivateOutlet() {
        const { user } = useContext(AppContext);
        const auth = user.role_id ? user.role_id : false;
        return auth ? <Cms/> : <Navigate to="/" />;
      }
    return (
        <div className='App'>
          <Routes>
              <Route path='/' element={<Client />}>
                  <Route index element={<Home />} />
                  <Route path='/category' element={<Category />} />
                  <Route path='/ticket' element={<Ticket />}/>
                  <Route path='/book-ticket' element={<BookTicket />}/>
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/logout' element={<Logout />} />
              </Route>
              <Route path='/admin' element={<PrivateOutlet />}>
                <Route index element={<Dashboard />} />
                <Route path='movies' element={<MoviesList />} />
                <Route path='category' element={<MoviesCategory />} />
                <Route path='person' element={<Person />} />
                <Route path='person/detail' element={<ActPerson/>}/>
                <Route path='person/detail/:id' element={<ActPerson/>}/>
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