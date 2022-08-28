import { Card, Carousel, Col, Row, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
import MovieItem from './MovieItem.js';


const ListMovie = () => {
    const { getMoviesShow } = useContext(AppContext);
    const [data, setData] = useState([]);
  
    useEffect(() => {
      getMoviesShow().then((res)=>{
        setData(res.data.data);
        
      })
    }, [])
  return (
    <div className="list-movies">
        <Row>
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                <br />
                <Card bordered={false}>
                    <Spin tip="Loading..." spinning={false}>
                        <Card title="PHIM ĐANG CHIẾU" bordered={false}>
                            <Row gutter={[16, 16]}>
                                 {data.map((item, index)=> (
                                    <MovieItem key={index} item = {item}/>
                                 ))}
                                
                            </Row>
                        </Card>
                    </Spin>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default ListMovie