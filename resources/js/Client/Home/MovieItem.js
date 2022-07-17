import { Card, Carousel, Col } from 'antd';
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';


const MovieItem = ({bannerLink}) => {

  return (
    <Col md={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 0 }}>
        <Card
            hoverable
            cover={<img alt="example" src={bannerLink} />}
          >
            <Meta title="Europe Street beat" description="www.instagram.com" />
      </Card>
    </Col>
  )
}

export default MovieItem