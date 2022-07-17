import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../Context.js';
import ListMovie from './Home/ListMovie.js';
import SliderReview from './Home/SliderReview.js';

const Home = () => {
  return (
    <div className="home">
        <SliderReview/>
        <ListMovie/>

    </div>
  )
}

export default Home