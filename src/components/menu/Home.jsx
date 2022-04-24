import React, { useEffect, useState }  from "react";
import { Layout, Menu, Space } from 'antd';
import { NavLink } from 'react-router-dom';
import { BrowserRouter, Route, Switch, Link, Router } from 'react-router-dom';

import Bienvenido from './Bienvenido';
import Pacientes from '../pacientes/Pacientes';
import Odontologos from '../odontologos/Odontologos';
import Turnos from '../turnos/Turnos';
import Logout from '../login/Logout';

const { Header, Content, Footer } = Layout;


const Home = ({onLogout}) => {


  return (
    
    <BrowserRouter>
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <NavLink to="/bienvenido">Home</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/pacientes">Pacientes</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/odontologos">Odontólogos</NavLink>
          </Menu.Item>
          <Menu.Item key="4">
            <NavLink to="/turnos">Turnos</NavLink>
          </Menu.Item>
          <Menu.Item key="5">
            <NavLink to="/" onClick={onLogout}>Salir</NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Switch>
            <Route exact path="/bienvenido" component={Bienvenido} />
            <Route exact path="/home" component={Bienvenido} />
            <Route path="/pacientes" component={Pacientes} />
            <Route path="/odontologos" component={Odontologos} />
            <Route path="/turnos" component={Turnos} />
            <Route path="/" component={Bienvenido} />
            
          </Switch>
          </div>
        </Space>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ronald@DH</Footer>
    </Layout>
    </BrowserRouter>
  );
};

export default Home;