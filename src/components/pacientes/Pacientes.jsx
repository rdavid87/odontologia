import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, Card, notification, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import apiUrl from '../../Config';
import axios from 'axios';

import ModalForm from "./FormPaciente";

const Pacientes = () => {

  const columns = [
    {title: 'Nombre', width: 20, dataIndex: 'nombre', key: 'nombre',},
    {title: 'Apellido', width: 10, dataIndex: 'apellido', key: 'apellido',},
    {title: 'DNI', width: 10, dataIndex: 'dni', key: 'dni',},
    {title: 'Fecha Ingreso', width: 20, dataIndex: 'fechaIngreso', key: 'fechaIngreso',},
    {title: 'Email', width: 20, dataIndex: 'email', key: 'email',},
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 20,
      render: (text, record) =>
            pacientes.length >= 1 ? (
              <Space>
              <Button type="primary" size="small" onClick={() => {
                  setVisible(true);
                  setPacienteId(record.id);
                }
              }>
                Editar
              </Button>
              <Popconfirm title="Desea eliminar este registro?" 
              onConfirm={() => handleDelete(record.id)}>
                <Button type="danger" size="small">Eliminar</Button>
              </Popconfirm>
              </Space>
            ) : null,
              
    },
  ];
    
    //consultamos la api para obtener los pacientes
    const [pacientes, setPacientes] = useState([]);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [pacienteId, setPacienteId] = useState(null);

    useEffect(() => {

      var config = {
        method: 'get',
        url: `${apiUrl}/api/pacientes`,
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
        if(error.response.status === 401 || error.response.status === 403){
          notification.error({
            message: 'Error',
            description: 'No tiene permisos para acceder a esta sección.',
          });
        }
        setError(true);
        setErrorMessage('No tiene permisos para acceder a esta sección.');

      });
            
    }, [])

    const onCreate = values => {
      
      let metodo = 'post';
      let mensaje = 'Paciente agregado correctamente.';
      if(values.id){
        metodo = 'put';
        mensaje = 'Paciente editado correctamente.';
      }

      var config = {
        method: metodo,
        url: `${apiUrl}/api/pacientes`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        data: values
      };

      axios(config)
      .then(function (response) {
        console.log('Paciente creado/enviado',response.data);

        if(metodo === 'post'){
          setPacientes([...pacientes, response.data]);
        }else{
          setPacientes(pacientes.map(paciente => paciente.id === values.id ? response.data : paciente));
        }  
        
        setError(false);
   
        notification.success({
          message: 'Éxito',
          description: mensaje,
        });
        //setOdontologos((response.data));
      })
      .catch(function (error) {
        notification.error({
          message: 'Error',
          description: 'Error al crear/enviar paciente.',
        });
        
      });

      setVisible(false);
      setPacienteId(null);
    };

    const handleDelete = key => {
      const dataSource = [...pacientes];
      setPacientes(dataSource.filter(item => item.id !== key));

      var config = {
        method: 'delete',
        url: `${apiUrl}/api/pacientes/${key}`,
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      };

      axios(config)
      .then(function (response) {
        console.log('Paciente eliminado',response.data);
        notification.success({
          message: 'Éxito',
          description: 'Paciente eliminado correctamente.',
        });
      })
      .catch(function (error) {
        setError(true);
        setErrorMessage(error.message);
      }
      );

    };

    return (
    
      <>
        <div className="site-card-wrapper">
            <Card title="Listado de Pacientes" bordered={false}>
              {!error ? (<>
                <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>Crear Paciente</Button>
                </Space>
  
                <ModalForm
                  visible={visible}
                  onCancel={() => {setVisible(false); setPacienteId(null);}}
                  onCreate={onCreate}
                  pacienteId={pacienteId}
                />
                  <Table key="tablePacientes" columns={columns} dataSource={pacientes} scroll={{ x: 1300 }} />
             </> ) : (
               <Alert message={errorMessage} type="error" />
             )}
            </Card>
        </div>
      
      </>
      )
    
};

export default Pacientes;

