import { Button, Card, Carousel, Col, Image, Row, Typography } from 'antd';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../Context.js';

const { Title } = Typography;
const SliderItem = ({itemLink}) => {
    useEffect(() => {
    }, []);
    return (
        <div className='slider-items'
            style={{  
                    backgroundImage: "url(" + itemLink + ")",
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                }}
        >
      
            <Row justify="space-around" align="middle" style={{width: '90%', height: '630px',  padding: '20px'}}>
                {/* <div style={{width: '50%', color: '#fff'}}>
                    <Title style={{color: '#fff'}}>Knights of Wales</Title>
                    <p style={{color: '#fff', fontSize: '18px'}}>I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font.</p>
                    <Button>Đặt vé</Button> <Button>Trailer</Button> <Button type='danger'>18+</Button>
                </div> */}
                <div>
                {/* <iframe className='preview-video' width="560" height="315" src="https://www.youtube.com/embed/G2SSFTZyrSs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
                </div>
            </Row>
        </div>

    )
}
export default SliderItem