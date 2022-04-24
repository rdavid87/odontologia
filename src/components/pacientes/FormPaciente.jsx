import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Divider,
  DatePicker,
} from 'antd';
import moment from 'moment';

import apiUrl from '../../Config';
import axios from 'axios';

const dateFormat = 'YYYY-MM-DD';

const ModalFormComponent = ({visible, onCancel, onCreate, pacienteId}) => {

  
  const [form] = Form.useForm();
  const [domicilioId, setDomicilioId] = useState(null);
  
  useEffect(() => {
    onInit(pacienteId);
  }, [pacienteId]);



  const onInit = (pacienteId) => {
    if(pacienteId!==null){

      var config = {
        method: 'get',
        url: `${apiUrl}/api/pacientes/${pacienteId}`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem("token")}`,
        }
      };

      axios(config)
      .then(function (response) {

        form.setFieldsValue({
          apellido: response.data.apellido,
          nombre: response.data.nombre,
          dni: response.data.dni,
          email: response.data.email,
          fechaIngreso: moment(response.data.fechaIngreso, dateFormat),
        });

        if(response.data.domicilio){
          form.setFieldsValue({
            calle: response.data.domicilio.calle,
            numero: response.data.domicilio.numero,
            localidad: response.data.domicilio.localidad,
            provincia: response.data.domicilio.provincia,
          });

          setDomicilioId(response.data.domicilio.id);
        }
        
      })
      .catch(function (error) {
        console.log(error);
      });

    }
  }
  

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
    visible={visible}
    title="Formulario de Pacientes"
    okText="Guardar"
    onCancel={onCancel}
    onOk={() => {
      form
        .validateFields()
        .then(values => {
          form.resetFields();
          var data = {
            nombre: values.nombre,
            apellido: values.apellido,
            dni: values.dni,
            fechaIngreso: values.fechaIngreso,
            email: values.email,
            domicilio:{
              calle: values.calle,
              numero: values.numero,
              localidad: values.localidad,
              provincia: values.provincia,

            }
          };
          if(pacienteId !== null){
            data["id"] = pacienteId;
            data["domicilio"]["id"]=domicilioId;
          }
          pacienteId=null;
          setDomicilioId(null);
          onCreate(data);
        })
        .catch(info => {
          
          console.log("Validate Failed:", info);
        });
    }}
  >
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'Nombre requerido!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Apellido"
        name="apellido"
        rules={[{ required: true, message: 'Apellido requerido!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="DNI"
        name="dni"
        rules={[{ required: true, message: 'DNI requerida!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Email requerida!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Fecha Ingreso"
        name="fechaIngreso"
        rules={[{ required: true, message: 'Fecha Ingreso requerida!' }]}
      >
        <DatePicker defaultValue={moment()} format={dateFormat} />
      </Form.Item>

      <Divider>Domicilio</Divider>

      <Form.Item
        label="Calle"
        name="calle"
        rules={[{ required: true, message: 'Calle requerida!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Localidad"
        name="localidad"
        rules={[{ required: true, message: 'Localidad requerida!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Número"
        name="numero"
        rules={[{ required: true, message: 'Número requerida!' }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="Provincia"
        name="provincia"
        rules={[{ required: true, message: 'Provincia requerida!' }]}
      >
        <Input />
      </Form.Item>

    </Form>
  </Modal>
  );
};

export default ModalFormComponent;
