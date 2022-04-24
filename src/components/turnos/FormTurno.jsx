import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Divider,
  DatePicker,
  Select,
} from 'antd';
import moment from 'moment';

import apiUrl from '../../Config';
import axios from 'axios';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

const ModalFormComponent = ({visible, onCancel, onCreate, turnoId}) => {

  
  const [form] = Form.useForm();
  const [pacientes, setPacientes] = useState([]);
  const [odontologos, setOdontologos] = useState([]);
  
  useEffect(() => {
    onInit(turnoId);
  }, [turnoId]);



  const onInit = (turnoId) => {
    if(turnoId!==null){

      var config = {
        method: 'get',
        url: `${apiUrl}/api/turnos/${turnoId}`,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem("token")}`,
        }
      };

      axios(config)
      .then(function (response) {

        form.setFieldsValue({
          odontologoId: response.data.odontologo.id,
          pacienteId: response.data.paciente.id,
          fecha: moment(response.data.fecha, dateFormat),
        });
        
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

  //carga pacientes y odontologos
  useEffect(() => {
    

    //pacientes
    var config = {
      method: 'get',
      url: `${apiUrl}/api/pacientes/view`,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
      }
    };

    axios(config)
    .then(function (response) {
      setPacientes((response.data));
    })
    .catch(function (error) {
    });

    //odontologos

    var config = {
      method: 'get',
      url: `${apiUrl}/api/odontologos/view`,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
      }
    };

    axios(config)
    .then(function (response) {
      setOdontologos((response.data));
    })
    .catch(function (error) {
    });



  }, [turnoId]);
    


  const optionsPacientes = pacientes.map(d => <Option key={d.id}>{d.nombre+" "+d.apellido}</Option>);
  const optionsOdontologos = odontologos.map(d => <Option key={d.id}>{d.nombre+" "+d.apellido}</Option>);

  return (
    <Modal
    visible={visible}
    title="Formulario de Turnos"
    okText="Guardar"
    onCancel={onCancel}
    onOk={() => {
      form
        .validateFields()
        .then(values => {
          form.resetFields();
          var data = {
            paciente: {id: values.pacienteId},
            odontologo: {id: values.odontologoId},
            fecha: values.fecha,
          };
          if(turnoId !== null){
            data["id"] = turnoId;
          }
          turnoId=null;
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
        label="Paciente"
        name="pacienteId"
        rules={[{ required: true, message: 'Paciente requerido!' }]}
      >
        <Select
    showSearch
    style={{ width: 200 }}
    placeholder="Search to Select"
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    filterSort={(optionA, optionB) =>
      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
    }
  >
    {optionsPacientes}
  </Select>

      </Form.Item>

      <Form.Item
        label="Odontólogo"
        name="odontologoId"
        rules={[{ required: true, message: 'Odontólogo requerido!' }]}
      >
        <Select
    showSearch
    style={{ width: 200 }}
    placeholder="Search to Select"
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    filterSort={(optionA, optionB) =>
      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
    }
  >
    {optionsOdontologos}
  </Select>
      </Form.Item>

      <Form.Item
        label="Fecha Turno"
        name="fecha"
        rules={[{ required: true, message: 'Fecha Turno requerida!' }]}
      >
        <DatePicker format={dateFormat} />
      </Form.Item>

    </Form>
  </Modal>
  );
};

export default ModalFormComponent;
