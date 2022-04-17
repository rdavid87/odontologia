import React from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import { NavLink } from 'react-router-dom';
import { BrowserRouter, Route, Switch, Link, Router } from 'react-router-dom';

import Principal from './Principal';
import Pacientes from '../pacientes/Pacientes';
import Odontologos from '../odontologos/Odontologos';

const { Header, Content, Footer } = Layout;


const Home = () => {

  return (
    <BrowserRouter>
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/Pacientes">Pacientes</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/Odontologos">Odontólogos</NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
      
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Switch>
            <Route exact path="/" component={Principal} />
            <Route exact path="/Pacientes" component={Pacientes} />
            <Route exact path="/Odontologos" component={Odontologos} />
          </Switch>
        </div>
        
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
    </BrowserRouter>
  );
};

export default Home;