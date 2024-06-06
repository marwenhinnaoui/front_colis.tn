import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import { setUser } from '../../../store/actions';
import { connect } from 'react-redux';

const LOGIN_API = `${config.baseUrl}/login`;



const FormSignin = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      
      const response = await axios({
        headers: {
          'Authorization': '',
          'Content-Type': 'application/json',
        },
        url: LOGIN_API,
        data: { email, password },
        method: 'POST'
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const onFinish = async (values) => {

    setLoading(true);
    try {
      const { email, password } = values;
      const response = await login(email, password);
      const { token } = response;
      const { role } = response.user;
      const { id } = response.user;



     if (response.user.role == 'c' &&  response.user.compte_valid==true ) {
      message.success('Connexion réussie');
      setUser(id, token, role);

      navigate('/dashboardClient') 
    }
      else if (response.user.role == 't' && response.user.valid_paiement == true && response.user.compte_valid==true) {
        setUser(id, token, role);
        navigate('/dashboardTransporteur')
        message.success('Connexion réussie');

      }
      else if (response.user.role == 'a') {
        message.success('Connexion réussie');
    
        setUser(id, token, role);
        navigate('/dashboardAdmin')
      }else if (response.user.role == 't' && (response.user.valid_paiement == false)) {
        message.error("Vous n'avez pas encore validé par l'admin de site!");
        console.log('token encore validé ', token );

      }else if (response.user.compte_valid== false) {
        message.error("Votre compte actuellement bloqué!");
        console.log('token bloqué ', token );

      }

    } 
    catch (error) {
      switch (error.response.status) {
        case 400:

          message.error('Erreur de validation: Veuillez vérifier vos données.');

          break;
        case 404:
          message.error('Ressource non trouvée.');

          break;
        default:
          message.error('Une erreur inattendue s\'est produite.');

      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{padding:'0', width:'70%', margin:'auto'}}
      size='small'

    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
          Se Connecter
        </Button>
              
              <Link to="/singup" style={{textDecoration: 'none' }}> Cliquez ici</Link> <span>,Si vous n'avez un compte.</span>
              
      </Form.Item>
    </Form>
  );
};


const mapDispatchToProps = {
  setUser
};

export default connect(null, mapDispatchToProps) (FormSignin);
