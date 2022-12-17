import { RollbackOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, InputNumber, Row, Select, Spin, Divider } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { openNotification } from '../../Client/Helper/Notification';
import { AppContext } from '../../Context';

const initialValues = {
    stars: [],
    directors: [],
}

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};
const { Search, TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';

const { Option } = Select;
const children = [];
const Actor = ({ keyID }) => {
    const { getMovies, getActors, getListPerson, getListCountry, getListCategory, updateStar } = useContext(AppContext);

    let navigate = useNavigate();
    const params = useParams();
    const [item, setItem] = useState({});
    const [loadingForm, setLoadingForm] = useState(false);
    const [form] = Form.useForm();
    const [pic, setPic] = useState();
    const [country, setCountry] = useState([]);
    const [categories, setCategories] = useState([]);
    const [person, setPerson] = useState([]);
    const [btnLoading, setBtnLoading] = useState(false);


    const [star, setStar] = useState([]);
    const [director, setDirector] = useState([]);



    useEffect(() => {
        getListCountry().then((res) => {
            setCountry(res.data.data);
        });
        getListCategory().then((res) => {
            setCategories(res.data.data);
        })
        getListPerson().then((res) => {
            setPerson(res.data.data)
        })

        getActors({ keyID }).then((res) => {
            if (res.data.data) {
                var data = res.data.data;
                var arr1 = [], arr2 = [];
                data.director.forEach(element => {
                    arr1.push(element.person_id)
                });
                data.star.forEach(element => {
                    arr2.push(element.person_id)
                });

                setDirector(arr1);
                setStar(arr2);
                form.setFieldsValue({
                    stars: arr2,
                    directors: arr1
                })
            }
        })

    }, [])



    for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    const changeStar = (value) => {
        setStar(value);
    };

    const changeDirector = (value) => {
        console.log(value);
        setDirector(value)
    };

    const updatePerson = () => {
        var values = {
            keyID: keyID,
            star: star,
            director: director
        }
        setBtnLoading(true);
        updateStar(values).then((res) => {
            openNotification(res.data);
            setBtnLoading(false);
        })
    }

    return (
        <>

            <div className="site-layout-background" style={{ minHeight: 480 }}>
                <Divider orientation="left" plain>
                    Nhân vật
                </Divider>



                <Form
                    {...formItemLayout}
                    layout="horizontal"
                    form={form}
                    labelAlign="left"
                    initialValues={initialValues}
                >
                    <Row>
                        <Col xs={24} xl={12}>
                            <Form.Item
                                label="Diễn viên"
                                name="stars"
                                style={{ marginBottom: 15 }}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Chọn diễn viên"
                                    onChange={changeStar}
                                >
                                    {person.map((p, index) => (
                                        <Option key={index} value={p.person_id}>{p.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Đạo diễn"
                                name="directors"
                                style={{ marginBottom: 15 }}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Chọn đạo diễn"
                                    onChange={changeDirector}
                                >
                                    {person.map((p, index) => (
                                        <Option key={index} value={p.person_id}>{p.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 6,
                                }}
                            >
                                <Button type="primary" onClick={updatePerson} loading={btnLoading} style={{ marginRight: '16px' }}>Lưu</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    )
}

export default Actor