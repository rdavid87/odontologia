import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
} from 'antd';

import apiUrl from '../../Config';
import axios from 'axios';

const ModalFormComponent = ({visible, onCancel, onCreate, odontologoId}) => {

  
  const [form] = Form.useForm();
  
  useEffect(() => {
    onInit(odontologoId);
  }, [odontologoId]);



  const onInit = (odontologoId) => {
    if(odontologoId!==null){

      var config = {
        method: 'get',
        url: `${apiUrl}/api/odontologos/${odontologoId}`,
        headers: { 
          'Authorization': `${localStorage.getItem("token")}`
        }
      };

      axios(config)
      .then(function (response) {

        form.setFieldsValue({
          apellido: response.data.apellido,
          nombre: response.data.nombre,
          matricula: response.data.matricula,
        });
        
      }
      )
      .catch(function (error) {
        console.log(error);
      }
      );

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
    title="Formulario de Odontologos"
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
            matricula: values.matricula,
          };
          if(odontologoId !== null){
            data["id"] = odontologoId;
          }
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
        label="Matricula"
        name="matricula"
        rules={[{ required: true, message: 'Matricula requerida!' }]}
      >
        <Input />
      </Form.Item>
  
    </Form>
  </Modal>
  );
};

export default ModalFormComponent;
