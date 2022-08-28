import { Button, Card, Carousel, Col, Row } from 'antd';
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect } from 'react'
import {Link , useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';

const MovieItem = ({item}) => {

  return (
    <Col md={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 0 }}>
        <Card
            hoverable
            cover={<img alt="example" src={APP_URL + '/images/movies' + item.image} />}
          >
            <Meta title={item.title} description={(<></>)} />
            Quốc gia: 
            
            <Row justify='space-between'>
              <Col>

              </Col>
              <Col>
                <Button><Link to={`/movies/detail?id=${item.id}`}> Xem thêm </Link></Button>
              </Col>
            </Row>
      </Card>
    </Col>
  )
}

export default MovieItem