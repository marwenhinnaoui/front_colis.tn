import { AppstoreAddOutlined,ClockCircleOutlined,CheckCircleFilled, CheckCircleOutlined,CheckOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, LoadingOutlined, EyeFilled, SoundFilled, FrownOutlined, MehOutlined, SmileOutlined, SmileFilled } from "@ant-design/icons";
import { CloseOutlined, DownOutlined, FieldNumberOutlined, GoldFilled, HomeOutlined, InfoCircleFilled, MailOutlined, PhoneOutlined, PlusOutlined, TagFilled, UserOutlined } from '@ant-design/icons';
import { Route, Routes, useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Col,
  Select,
  Modal,
  Row,
  Spin,
  Table,
  Form, 
  Input,
  message,
  Rate,
  Flex
} from "antd";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import config from "../../config";
import { connect } from "react-redux";
import getUserData from "../../api/getUserdata";
import updateUser from "../../api/updateuserdata";
const { TextArea } = Input;



const Tables = ({userId , userToken}) => {
  const [form] = Form.useForm();
  const [editColis, seteditColis] = useState(null);
  const [TransporteurDetail, setTransporteurDetail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [IsModalVisibleDetail, setIsModalVisibleDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpenReclamation, setIsModalOpenReclamation] = useState(false);
  const [isModalOpenAvis, setIsModalOpenAvis] = useState(false);

  const [avis, setAvis] = useState(0);
  const [description, setDescription] = React.useState('');

const [loading, setLoading]=useState(false)
const [data, setData]=useState(null)
const navigate=useNavigate()


const handleRateChange = (value) => {
  setAvis(value);
  setIsModalOpenAvis(false);
  donnerAvis(value)
};
const donnerAvis = async (newRating) => {
  try {
    const userData = {
      rating: newRating,
    };

    const result = await updateUser(userId, userData, userToken);
    console.log('Avis' , result);

    console.log('User updated successfully:', result);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
const customIcons = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined/>,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};


const showModalAvis = (record) => {
  setIsModalOpenAvis(true);

};

const handleCancelAvis = () => {
  setIsModalOpenAvis(false);
};
  const columns = [
    {
      title: "MATRICULE",
      dataIndex: "matricule",
      key: "matricule",
      render: (text) => (
        <span style={{fontWeight:'600'}}>{text}</span>
      )
    },
    {
      title: "DESTINAIRE",
      dataIndex: "destenaire_email",
      key: "destenaire_email",
    },
    {
      title: "NUMERO TEL",
      dataIndex: "destenaire_tel",
      key: "destenaire_tel",
    },

    {
      title: "PRIX (tnd)",
      dataIndex: "prix",
      key: "prix",
      render: (text) => (
        <span>{text}0 tnd</span>
      )
    },
    {
      title: "POIDS (kg)",
      dataIndex: "poid_total",
      key: "poid_total",
      render: (text) => (
        <span>{text} kg</span>
      )
    },
    {
      title: "STATUS",
      dataIndex: "status_colis",
      key: "status_colis",
      render: (text) => {
        var color=""
        var icon
       if(text === "Traitement"){
            icon = <ClockCircleOutlined />
            color= "#1677ff"
       }else if(text === "Pré-acceptation"){
        icon = <CheckCircleOutlined />
        color= "#fa8c16"
       }else if(text === "Accepté"){
        icon = <CheckCircleOutlined />
        color= "#52c41a"
       }else if (text === "Terminé"){
        icon = <CheckCircleFilled />
        color= "#52c41a"
       }else if(text === "En route"){
        icon = <LoadingOutlined />
        color= "#1677ff"
   }
        return (
          <span style={{ color: color }}>
            {icon} {text}
          </span>
        )
      },
    },
    {
      title: "ACTION",
      dataIndex: "actions",
      key: "actions",
      render: (item, record) => (
            <div>
            <div className="ant-employed ">
              <span></span>
              <div className="d-flex " style={{width: "100%", justifyContent: 'space-between'}}>
                { record.status_colis == 'Accepté' || record.status_colis == 'En route' || record.status_colis == 'Terminé'  ?<></>:<DeleteOutlined style={{margin:'0px'}} className="Action_delete" onClick={() => deleteColis(record.id)}/>}
                { record.status_colis == 'Pré-acceptation' || record.status_colis == 'Accepté' || record.status_colis == 'En route' || record.status_colis == 'Terminé'  ?<EyeFilled style={{margin:'0px'}} className="Action_delete" onClick={() => showModalDetail(record)}/>: <></>}
                { record.status_colis == 'Pré-acceptation' || record.status_colis == 'Accepté' || record.status_colis == 'En route' || record.status_colis == 'Terminé'  ?<SoundFilled style={{margin:'0px'}} onClick={() => showModalReclamtion(record)} />: <></>}
                
                { record.status_colis !== 'Traitement' ? <SmileFilled onClick={()=>showModalAvis()} />: <></>}

                

              </div>
            </div>
          </div>
      )},
  
  ];

  //Delete
  const deleteColis=(Id)=>{

    Modal.confirm({
      title: "CONFIRMATION",
      icon: <ExclamationCircleOutlined />,
      content: "Confirmation de la supprission",
      okType: "danger",
      okText: "Oui",
      cancelText: "Annuler",
      onOk: () => {
    axios.delete(config.baseUrl+"/delete_colis/"+Id,
    
    {
      headers: {
        Authorization: `Token ${userToken}`, 
      },
    }
    ).then((response)=>
    {
      setData(data.filter(item=>item.id!==Id));
    })

    }});
}


const showModal = (record) => {

  setIsModalVisible(true);
  console.log('record', record);
  seteditColis({ ...record });
  console.log('form', form);
  form.setFieldsValue(record);
};

const showModalDetail = async(record)=>{
  setIsModalVisibleDetail(true);
  console.log('record', record);
    try {
      const result = await getUserData(record.transporteur, userToken);
      setTransporteurDetail(result);
      console.log('result',result);

    } catch (error) {
      console.error('Erreur:', error);
    }

  console.log('ColisDetail', TransporteurDetail);
}




  useEffect(() => {

    axios.get(
      config.baseUrl+'/get_colis'+'/'+userId,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      }
    ).then(response => {
      console.log('response==', response.data);
      setData(response.data);
      setLoading(true);
    }).catch(error => {
      console.log(error);
    });
  }, [userToken, data]); 
  


  
  
 




  //Reclamation Modal
  const showModalReclamtion = (record) => {
    setSelectedRecord(record);
    setIsModalOpenReclamation(true);

  };
  const handleCancelReclamtion = () => {
    setIsModalOpenReclamation(false);
    // setSelectedRecord(null);
  };


  //Modal
  //Update
  const handleCancel = () => {
    setIsModalVisible(false);
    setTransporteurDetail(null)
  };
  const handleCancelDetail = () => {
    setIsModalVisibleDetail(false);
    setTransporteurDetail(null);
  };


  const onFinish =  async (values)  => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');

    const date_reclamation = `${yyyy}-${mm}-${dd}`;


    const {  description, sujet} = values
    console.log('description',selectedRecord.client);


    const response = await axios({
      headers: {
        'Content-Type': 'application/json',
      },
      url: config.baseUrl + '/cree_reclamation',
      data:{description, sujet, defendeur: selectedRecord.client,reclamant: userId, date_reclamation, colis:selectedRecord.id, reponse:"non" },
      method: 'POST'
    });
    if(response.data){
      message.success("Réclamation Créé")
      setIsModalOpenReclamation(false)
    }else{
      message.error("Erreur de création de réclamation!")
    }
  } 




  return (
    <div>


<Modal footer={[]} open={isModalOpenAvis} onCancel={handleCancelAvis} >
    <Flex  gap="middle" vertical style={{alignItems:'center', justifyContent:'center'}}>
    <Rate 
    style={{fontSize:"40px"}}
      defaultValue={avis} 
      character={({ index = 0 }) => {
        const icon = customIcons[index + 1];
        return icon;
      }} 
      onChange={handleRateChange}
    />
  </Flex>
    </Modal>
   <Modal footer={[]} open={isModalOpenReclamation} onCancel={handleCancelReclamtion} >
    
    <Form
                        
                        form={form}
                            style={{margin:'auto',width:'100%', paddingTop:'30px'}}
            
            
            
                            onFinish={onFinish}
                
              >
    
    
    
    
    
        <Form.Item
          name='sujet'
          rules={[
            { required: true, message: 'Entrez le sujet de réclamation!' },
        ]}
        >
                <Input
    size='small'
    
              placeholder='Sujet de réclamation'
    
          />
        </Form.Item>      
    
            
            
              
        <Form.Item
          name='description'
          rules={[
            { required: true, message: 'Entrez le description de réclamation!' },
        ]}
        > 
            
    
        <TextArea           placeholder='Description de réclamation'
     rows={4} />
    
    </Form.Item>
    
            
                <Form.Item>
            
            
                    
                <Button
                        style={{lineHeight:'0px', height:'35px', marginTop:'10px'}}
                        type="primary" htmlType="submit" >
                            Crée Réclamation
                  </Button>
                  </Form.Item>
              </Form>
    
        </Modal>

        <div className="tabled fs-3">

        <Modal open={IsModalVisibleDetail}  onCancel={handleCancelDetail} footer={[]}>
          {TransporteurDetail ?(
            <>

          <h5>Détails de Transporteur</h5>
          <div
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              width: "100%",
              height: "1px",
              background: "#000",
              opacity: "0.1",
            }}
          ></div>
            <div  >
          <img style={{              borderRadius:'50%', width:'130px',marginBottom:'10px', height:'130px'}} src={config.baseUrl +TransporteurDetail.profile_image}alt="img" />
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Nom et Prénom: </span>{TransporteurDetail.namelastname}</div>
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Email:</span> {TransporteurDetail.email}</div>
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Numéro:</span> {TransporteurDetail.phone_number}</div>
          </div>
          



          </>
          ):(<Spin />)}

        </Modal>
        <Row className="" gutter={[24, 0]}>
          <Col  xs="24" xl={24}>
            
            <Card
              bordered={false}
              className="criclebox tablespace mb-24" 
              title='Tous les colis'

              extra={(!loading) ? <Spin /> : ''}
            >
              <div className="table-responsive">
                <Table
                  
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  className="ant-border-space"
                  
                />
              </div>
            </Card>
          </Col>
          </Row>
      </div>


    </div>
  );
}
const mapStateToProps = state => ({
  userId: state.user.id,
  userToken: state.user.token,
});
export default connect(mapStateToProps) (Tables);
