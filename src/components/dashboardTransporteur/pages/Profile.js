import Main from '../layout/Main';
import { useState, useEffect } from 'react';
import getUserData from '../../api/getUserdata';
import { Spin, Modal, Form, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import config from '../../config';
import { EditTwoTone } from '@ant-design/icons';
import axios from 'axios';

const ProfileTransporteur = ({ userId, userToken }) => {
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  
  const updateUser = async (userId, userData, userToken) => {
    try {
      const response = await axios.put(
        `${config.baseUrl}/modifier_profile/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Token ${userToken}`,
            'Content-Type': 'application/json',
  
          },
        }
      );
  
      const updatedUser = response.data;
      console.log(response.data);
      fetchData();
      return updatedUser;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };
      const fetchData = async () => {
      try {
        const result = await getUserData(userId, userToken);
        setData(result);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
  useEffect(() => {


    fetchData();
  }, [userId, userToken]);

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      namelastname: data.namelastname,
      phone_number: data.phone_number,
      city: data.city,
      zip_code: data.zip_code,
      billing_address: data.billing_address,
    });
  };

  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();
      const updatedData = { ...data, ...values };
      const result = await updateUser(userId, updatedData, userToken);
      setData(result);
      message.success('Modification succès')
      setIsModalVisible(false);
    } catch (error) {
      message.error('Erreur de modification')

      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Main>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {data ? (
          <>
            <div style={{ marginTop: '30px', width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden' }}>
              <img src={config.baseUrl + data.profile_image} alt='profile' />
            </div>

            <div>
              <div style={{ fontSize: '20px', marginBottom: '20px', width: '100%', textAlign: 'right' }}>
                <EditTwoTone style={{ fontSize: '20px' }} onClick={showModal} />
              </div>

              <p style={{ fontSize: '14.5px' }}><b>Nom et prénom:</b> {data.namelastname}</p>
              <p style={{ fontSize: '14.5px' }}><b>Numéro télephone:</b> {data.phone_number}</p>
              <p style={{ fontSize: '14.5px' }}><b>Email:</b> {data.email}</p>
              <p style={{ fontSize: '14.5px' }}><b>Ville:</b> {data.city}</p>
              <p style={{ fontSize: '14.5px' }}><b>Code postal:</b> {data.zip_code}</p>
              <p style={{ fontSize: '14.5px' }}><b>Adresse:</b> {data.billing_address}</p>
            </div>

            <Modal open={isModalVisible} footer={[

              <Button type="primary" onClick={handleOk} key="1">
              <EditTwoTone /> Modifier
              </Button>,
            ]} onCancel={handleCancel}>
              <Form form={form} layout="vertical">
                <Form.Item name="namelastname" label="Nom et prénom" rules={[{ required: true, message: 'Please input your name!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="phone_number" label="Numéro télephone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="city" label="Ville" rules={[{ required: true, message: 'Please input your city!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="zip_code" label="Code postal" rules={[{ required: true, message: 'Please input your zip code!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="billing_address" label="Adresse" rules={[{ required: true, message: 'Please input your address!' }]}>
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </>
        ) : (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Spin />
          </div>
        )}
      </div>
    </Main>
  );
};

const mapStateToProps = state => ({
  userId: state.user ? state.user.id : null,
  userToken: state.user ? state.user.token : null,
});

export default connect(mapStateToProps)(ProfileTransporteur);
