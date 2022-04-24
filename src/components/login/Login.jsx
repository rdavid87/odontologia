import React, { useState, useEffect,useRef } from 'react';

import { Form, Input, Button, notification } from 'antd';
import { Row, Col, Slider, Card } from 'antd';
import apiUrl from '../../Config';



const Login = ({onLogin}) => {

  const[form] = Form.useForm();

  const onFinish = (values) => {
    
    validaLogin(values.username, values.password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const validaLogin = (user, pass) => {
    
    var axios = require('axios');
var data = JSON.stringify({
  "username": user,
  "password": pass
});

var config = {
  method: 'post',
  url: `${apiUrl}/api/auth/signin`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  let respuesta = JSON.stringify(response.data);
  if(respuesta.includes("tokenType")){
    let token = response.data.tokenType + " " + response.data.accessToken;
    //localStorage.setItem("token", token);
    //localStorage.setItem("user",  JSON.stringify(response.data));
    //window.location.href = "/home";
    onLogin(JSON.stringify(response.data), token);
  }
})
.catch(function (error) {
  
  if(error.response.status === 401 || error.response.status === 403){
    notification.error({
      message: 'Error',
      description: 'Usuario o contraseña incorrectos.',
    });
  }

});

  };


  return (

      
    <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
      <Col span={8}>
        <Card title="Sistema de Turnos">

    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>



      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Ingresar
        </Button>
      </Form.Item>
    </Form>

        </Card>
      </Col>
    </Row>
  );
};

export default Login;