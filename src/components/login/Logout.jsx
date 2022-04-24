import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

const example ={
    width: '50px',
    height: '50px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '10%',

}
const contenedor ={
    position: 'relative',
  }

const Logout = ({onLogout}) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            //redirecciona al login
            //localStorage.removeItem('token');
            //localStorage.removeItem('user');
            //window.location.href = '/';
            onLogout();

        }, 3000);

    }, []);


    return (
        <div style={contenedor}>
            <div style={example}>
                <Spin tip="Destruyendo todo..." size="large" />
                
            </div>
        </div>
    );
};

export default Logout;