import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, Card, notification, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import apiUrl from '../../Config';
import axios from 'axios';

import ModalForm from "./FormTurno";

const Turnos = () => {

  const columns = [
    {title: 'Fecha', width: 10, dataIndex: 'fecha', key: 'fecha',},
    {title: 'Paciente', width: 10, dataIndex: 'pacienteName', key: 'pacienteName',},
    {title: 'Odontólogo', width: 10, dataIndex: 'odontologoName', key: 'odontologoName',},
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 20,
      render: (text, record) =>
            turnos.length >= 1 ? (
              <Space>
              <Button type="primary" size="small" onClick={() => {
                  setVisible(true);
                  setTurnoId(record.id);
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
    const [turnos, setTurnos] = useState([]);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [turnoId, setTurnoId] = useState(null);

    useEffect(() => {

      var config = {
        method: 'get',
        url: `${apiUrl}/api/turnos`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        }
      };
      
      axios(config)
      .then(function (response) {
        var mapear = response.data.map(function(turno){
            return {
                id: turno.id,
                key: turno.id,
                fecha: turno.fecha,
                pacienteName: turno.paciente.nombre + ' ' + turno.paciente.apellido,
                odontologoName: turno.odontologo.nombre + ' ' + turno.odontologo.apellido,
            }
        });
        setTurnos(mapear);

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
      let mensaje = 'Turno agregado correctamente.';
      if(values.id){
        metodo = 'put';
        mensaje = 'Turno editado correctamente.';
      }

      var config = {
        method: metodo,
        url: `${apiUrl}/api/turnos`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        data: values
      };

      axios(config)
      .then(function (response) {

        //hacemos una nueva peticion para obtener el turno recien creado
        getTurnoById(metodo, response.data.id);
        //fin de la peticion
    
          setError(false);
              
          notification.success({
            message: 'Éxito',
            description: mensaje,
          });
      })
      .catch(function (error) {
        notification.error({
          message: 'Error',
          description: 'Error al crear/enviar turno.',
        });
        
      });

      setVisible(false);
      setTurnoId(null);
    };

    const handleDelete = key => {
      const dataSource = [...turnos];
      setTurnos(dataSource.filter(item => item.id !== key));

      var config = {
        method: 'delete',
        url: `${apiUrl}/api/turnos/${key}`,
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      };

      axios(config)
      .then(function (response) {
        console.log('Turno eliminado',response.data);
        notification.success({
          message: 'Éxito',
          description: 'Turno eliminado correctamente.',
        });
      })
      .catch(function (error) {
        setError(true);
        setErrorMessage(error.message);
      }
      );

    };

    const getTurnoById = (metodo, id) => {
      var config = {
        method: 'get',
        url: `${apiUrl}/api/turnos/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        }
      };

      axios(config)
      .then(function (response) {
        //mapeamos los datos
        var mapear = {
                id: response.data.id,
                key: response.data.id,
                fecha: response.data.fecha,
                pacienteName: response.data.paciente.nombre + ' ' + response.data.paciente.apellido,
                odontologoName: response.data.odontologo.nombre + ' ' + response.data.odontologo.apellido,
            }
        
        
        if(metodo === 'post'){
          setTurnos([...turnos, mapear]);
        }else{
          setTurnos(turnos.map(turno => turno.id === id ? mapear : turno));

        }


      
      })
      .catch(function (error) {
        console.log('error=>',error);
        if(error.response.status === 401 || error.response.status === 403){
          notification.error({
            message: 'Error',
            description: 'No tiene permisos para acceder a esta sección.',
          });
        }
        setError(true);
        setErrorMessage('No tiene permisos para acceder a esta sección.');
      });
    }



    return (
    
      <>
        <div className="site-card-wrapper">
            <Card title="Listado de Turnos" bordered={false}>
              {!error ? (<>
                <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>Crear Turno</Button>
                </Space>
  
                <ModalForm
                  visible={visible}
                  onCancel={() => {setVisible(false); setTurnoId(null);}}
                  onCreate={onCreate}
                  turnoId={turnoId}
                />
                  <Table key="tableTurnos" columns={columns} dataSource={turnos} scroll={{ x: 1300 }} />
             </> ) : (
               <Alert message={errorMessage} type="error" />
             )}
            </Card>
        </div>
      
      </>
      )
    
};

export default Turnos;

