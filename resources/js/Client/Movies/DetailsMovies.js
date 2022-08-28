import { Avatar, Breadcrumb, Button, Card, Carousel, Col, Divider, Image, Rate, Row, Spin, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta.js';
import React, { useContext, useEffect, useState } from 'react'
import {Link , useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const { Title } = Typography;
const DetailsMovies = () => {
    const [movies, setMovies] = useState([]);
    const { getMovies, getActors } = useContext(AppContext);
    const [value, setValue] = useState(3);
    const [visible, setVisible] = useState(false);
    const [star, setStar] = useState([]);
    const [director, setDirector] = useState([]);


    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const movieID = queryParams.get('id');
        //get movies
        if(movieID) {
            getActors({keyID: movieID}).then((res) => {
                setStar(res.data.data.star);
                setDirector(res.data.data.director);
            })
            getMovies(movieID).then((res) => {
                setMovies(res.data.data)
            })
        }
    },[])

    return (
        <div>
            <Row>
                <Col xs={{ span: 24, offset: 0 }} lg={{ span: 20, offset: 2 }} gutter={[16, 16]}>
                    <br />
                    
                    <Card bordered={false} title=''>
                        <Spin tip="Đang tải..." spinning={false}>
                        <Breadcrumb style={{paddingBottom: '10px'}}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="/movies">movies</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{movies.title ? movies.title.toLowerCase() : ""}</Breadcrumb.Item>
                        </Breadcrumb>
                            <Row>
                                <Col>
                                <Image
                                    preview={{
                                    visible: false,
                                    }}
                                    width={600}
                                    src={APP_URL + '/images/movies' + movies.image} 
                                />
                                </Col>
                                <Col style={{paddingLeft: '20px'}}>
                                    <Title level={3}>{movies.title}</Title>
                                    <ul className='movie-infor'>
                                        <li><span>Phân loại: </span> C16 - PHIM DÀNH CHO KHÁN GIẢ TỪ 16 TUỔI TRỞ LÊN</li>
                                        <li><span>Đạo diễn: </span> {director.map((item) => (<>{item.name} , </>))}</li>
                                        <li><span>Diễn viên: </span> {star.map((item, index) => (<>{item.name} , </>))}</li>
                                        <li><span>Thể loại: </span>{movies.category ? movies.category.name : ""}</li>
                                        <li><span>Khởi chiếu: </span>{movies.release_date}</li>
                                        <li><span>Thời lượng: </span>{movies.duration * 60 } phút</li>
                                        <li><span>Ngôn ngữ: </span>{movies.language}</li>
                                        <li><span>
                                                <Rate tooltips={desc} onChange={setValue} value={value} />
                                        </span></li>
                                    </ul>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16}>
                                    <Divider orientation="left">Mô tả</Divider>
                                    <div dangerouslySetInnerHTML={{__html: movies.description}}></div>
                                    <Divider orientation="left">Nhân vật</Divider>
                                    <Row gutter={[16, 8]} style={{marginTop: '10px'}}>
                                        {star.map((item, index)=> (
                                            <Col md={{ span: 4, offset: 0 }} lg={{ span: 4, offset: 0 }} style={{alignItems: 'center'}}> 
                                                <Row justify='center'>
                                                    <Avatar
                                                        size={{
                                                        xs: 24,
                                                        sm: 32,
                                                        md: 40,
                                                        lg: 64,
                                                        xl: 80,
                                                        xxl: 100,
                                                        }}
                                                        src={APP_URL + '/images' + item.image} 
                                                    />
                                                </Row>
                                                <Row justify='center' style={{marginTop: '10px'}}>
                                                    {item.name}
                                                </Row>
                                            </Col>

                                            
                                        ))}
                                    </Row>
                                </Col>
                            </Row>
                            
                        </Spin>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default DetailsMovies