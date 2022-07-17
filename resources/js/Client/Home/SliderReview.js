import { Card, Carousel } from 'antd';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
import SliderItem from './SliderItem.js';
import BoxTicket from './BoxTicket.js'

const SliderReview = () => {

  return (
    <div className="slider-review">
      <Carousel autoplay>
        <div>
          <SliderItem itemLink = "http://filmcenter.vn/images/banner_1.jpg"/>
        </div>
        <div>
          <SliderItem itemLink = "http://filmcenter.vn/images/banner_2.jpg"/>
        </div>
        <div>
          <SliderItem itemLink = "http://filmcenter.vn/images/banner_3.jpg"/>
        </div>
    
        </Carousel>
        <div className='box-buy-ticket'>
            <BoxTicket/>
        </div>
    </div>
  )
}

export default SliderReview