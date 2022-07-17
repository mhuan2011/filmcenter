import { Card, Carousel, Col, Row, Spin } from 'antd';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
import MovieItem from './MovieItem.js';


const ListMovie = () => {

  return (
    <div className="list-movies">
        <Row>
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                <br />
                <Card bordered={false}>
                    <Spin tip="Loading..." spinning={false}>
                        <Card title="PHIM ĐANG CHIẾU" bordered={false}>
                            <Row gutter={[16, 16]}>
                                <MovieItem bannerLink = "https://cdn.galaxycine.vn/media/2022/7/13/1350wx900h_1657696049421.jpg"/>
                                <MovieItem bannerLink = "https://cdn.galaxycine.vn/media/2022/7/4/1350wx900h_1656923606085.jpg"/>
                                <MovieItem bannerLink = "https://cdn.galaxycine.vn/media/2022/6/14/1350wx900h_1655176461942.jpg"/>
                                <MovieItem bannerLink = "https://cdn.galaxycine.vn/media/2022/6/14/1350wx900h_1655176461942.jpg"/>
                                <MovieItem bannerLink = "https://cdn.galaxycine.vn/media/2022/6/14/1350wx900h_1655176461942.jpg"/>
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