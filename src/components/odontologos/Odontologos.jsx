import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, Card, notification, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import apiUrl from '../../Config';
import axios from 'axios';

import ModalForm from "./FormOdontologo";




const Odontologos = () => {

  const columns = [
    {title: 'Nombre', width: 20, dataIndex: 'nombre'},
    {title: 'Apellido', width: 20, dataIndex: 'apellido'},
    {title: 'Matricula', width: 15, dataIndex: 'matricula'},
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 20,
      render: (text, record) =>
            odontologos.length >= 1 ? (
              <Space>
              <Button type="primary" size="small" onClick={() => {
                  setVisible(true);
                  setOdontologoId(record.id);
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



    const [odontologos, setOdontologos] = useState([]);
    const [odontologoId, setOdontologoId] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [visible, setVisible] = useState(false);
  
    //cargamos los odontologos
    useEffect(() => {

      let config = {
        method: 'get',
        url: `${apiUrl}/api/odontologos`,
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

    //formulario para agregar un odontologo

    const onCreate = values => {
      
      let metodo = 'post';
      let mensaje = 'Odontologo agregado correctamente.';
      if(values.id){
        metodo = 'put';
        mensaje = 'Odontologo editado correctamente.';
      }

      var config = {
        method: metodo,
        url: `${apiUrl}/api/odontologos`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        data: values
      };

      axios(config)
      .then(function (response) {
        console.log('Odontologo creado/enviado',response.data);

        if(metodo === 'post'){
          setOdontologos([...odontologos, response.data]);
        }else{
          setOdontologos(odontologos.map(odontologo => odontologo.id === values.id ? response.data : odontologo));
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
          description: 'Error al crear/enviar odontologo.',
        });
        
      });

      setVisible(false);
      setOdontologoId(null);
    };

    const handleDelete = key => {
      const dataSource = [...odontologos];
      setOdontologos(dataSource.filter(item => item.id !== key));

      var config = {
        method: 'delete',
        url: `${apiUrl}/api/odontologos/${key}`,
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      };

      axios(config)
      .then(function (response) {
        console.log('Odontologo eliminado',response.data);
        notification.success({
          message: 'Éxito',
          description: 'Odontologo eliminado correctamente.',
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
          <Card title="Listado de Odontologos" bordered={false}>
            {!error ? (<>
              <Space style={{ marginBottom: 16 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>Crear Odontologo</Button>
              </Space>

              <ModalForm
                visible={visible}
                onCancel={() => {setVisible(false); setOdontologoId(null);}}
                onCreate={onCreate}
                odontologoId={odontologoId}
              />
                <Table key="tableOdontologos" columns={columns} dataSource={odontologos} scroll={{ x: 1300 }} />
           </> ) : (
             <Alert message={errorMessage} type="error" />
           )}
          </Card>
      </div>
    
    </>
    )
    
};

export default Odontologos;

