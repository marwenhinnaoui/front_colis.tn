import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Spin , Card, FloatButton, message} from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import Main from '../layout/Main';
import config from '../../config';
import { DeleteFilled, EditFilled, EyeInvisibleOutlined, EyeTwoTone, PlusOutlined } from '@ant-design/icons';

const CrudAdmin = ({ userId, userToken, userRole }) => {
  const [data, setData] = useState([]);
  const [_record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}/get_all_admins/`+userId);
      const filteredData = response.data.filter(user => user.role === 'a');
      setData(filteredData);
      setLoading(false);
      console.log('filteredData',response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    confirm({
        title: 'Effacé Utilisateur',
        icon: <DeleteFilled style={{color:'#ff4d4f'}}/>,
  
        onOk() {
          axios.delete(
            `${config.baseUrl}/delete_admin/${id}`,
  
        
          ).then(res => {
  
            message.success('Utilisateur Effacé!');
            fetchData()
          }).catch(err => {
            console.error(err);
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    
  };

  const handleEdit = async () => {
    try {
      const formData = form.getFieldsValue();
      const {  namelastname, email, password, phone_number } = formData;
        console.log('---------------',  _record, namelastname, email, password, phone_number);
      await axios.put(`${config.baseUrl}/update_admin/${_record}`, {
        namelastname,
        email,
        password,
        phone_number,
        role: "a"
      }, );
      message.success("Admin Modifié!!")

      
      fetchData();
      setModalVisibleEdit(false); 
    } catch (error) {
        message.error("Erreur Modification!!")

      console.error('Erreur editing admin:', error);
    }
  };


  const onFinish = async (values) => {
    try {
      const { namelastname, email, password } = values;
        console.log(namelastname, email, password);
      await axios.post(`${config.baseUrl}/ajouter_admin`, { namelastname, email, password, phone_number:0 , role:"a"}, {
        headers: { Authorization: `Bearer ${userToken}` }, 
      });
      message.success("Admin Ajouté!")
      fetchData();
      setModalVisible(false)
    } catch (error) {
        message.error("Erreur Ajout!")

      console.error('Error adding admin:', error);
    }
  }



  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nom', dataIndex: 'namelastname', key: 'namelastname' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <div>
        <DeleteFilled style={{marginRight:'15px'}} onClick={() => handleDelete(record.id)} />

        <EditFilled onClick={() => {
          form.setFieldsValue(record);
          setRecord(record.id)
          setModalVisibleEdit(true);
        }}/>
      </div>
    )}
  ];

  return (
    <Main>
      <FloatButton icon={<PlusOutlined />} type="primary"  onClick={() => setModalVisible(true)} />
      <Card
              style={{ width: "94%" }}
              bordered={false}
              className="criclebox tablespace mb-24"
            >
      <div className="table-responsive">
      <Table dataSource={data} columns={columns} 
                        pagination={false}
                        className="ant-border-space"
      loading={loading} rowKey="id" />
      </div>
      </Card>
      <Modal
      footer={[]}
        title="Ajouter Admin"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      
      >
        <Form  form={form} layout="vertical"
        onFinish={onFinish}

        >
          <Form.Item name="namelastname" label="Name" rules={[{ required: true,  message: 'Entrer le Nom!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true ,  message: 'Entrer Email!'}]}>
            <Input />
          </Form.Item>
          
        <Form.Item
                 label="Numéro télephone" 
            name="phone_number"
            rules={[
                { required: true, message: 'Entrez votre numéro de téléphone!' },
                { pattern: /^\d{8}$/, message: 'Le numéro de téléphone doit être composé de 8 chiffres.' }
            ]}
        >

            
            <Input   />
        </Form.Item>
        <Form.Item
         label="Mot de passe" 
            name="password"
            rules={[
            { 
            required: true, 
            message: "Entrez votre Mot de passe!" 
            },
            {
            min: 8,
            message: 'Le mot de passe doit contenir au moins 8 caractères.'
            },
            {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, et un symbole.'
            }
            ]}
            >
            <Input.Password
            autoComplete="new-password"
                style={{padding: "0 11px"}}
            />
            </Form.Item>
        <Button type="primary" htmlType="submit">
      Ajouter Admin
    </Button>
        </Form>
      </Modal>

      <Modal
      footer={[]}
        title="Add/Edit Admin"
        open={modalVisibleEdit}
        onCancel={() => {
          setModalVisibleEdit(false);
          form.resetFields();
        }}
      
      >
        <Form  form={form} layout="vertical"
        onFinish={handleEdit}

        >
          <Form.Item name="namelastname" label="Name" rules={[{ required: true,  message: 'Entrer le Nom!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true ,  message: 'Entrer Email!'}]}>
            <Input />
          </Form.Item>
          
        <Form.Item
                 label="Numéro télephone" 
            name="phone_number"
            rules={[
                { required: true, message: 'Entrez votre numéro de téléphone!' },
                { pattern: /^\d{8}$/, message: 'Le numéro de téléphone doit être composé de 8 chiffres.' }
            ]}
        >

            
            <Input   />
        </Form.Item>
        <Form.Item
         label="Mot de passe" 
            name="password"
            rules={[
            { 
            required: true, 
            message: "Entrez votre Mot de passe!" 
            },
            {
            min: 8,
            message: 'Le mot de passe doit contenir au moins 8 caractères.'
            },
            {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, et un symbole.'
            }
            ]}
            >
            <Input.Password
            autoComplete="new-password"
                style={{padding: "0 11px"}}
            />
            </Form.Item>
        <Button type="primary" htmlType="submit">
      Edit Admin
    </Button>
        </Form>
      </Modal>
    </Main>
  );
};

const mapStateToProps = state => ({
  userId: state.user ? state.user.id : null,
  userToken: state.user ? state.user.token : null,
  userRole: state.user ? state.user.role : null,
});

export default connect(mapStateToProps)(CrudAdmin);
