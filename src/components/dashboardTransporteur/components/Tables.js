import {
  AppstoreAddOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ControlFilled,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeFilled,
  FilePdfFilled,
  FilterFilled,
  FrownOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  MehOutlined,
  PlusCircleFilled,
  SecurityScanFilled,
  SmileFilled,
  SmileOutlined,
  SoundFilled,
} from "@ant-design/icons";
import emailjs from 'emailjs-com';

import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  FloatButton,
  Form,
  Input,
  List,
  Modal,
  Rate,
  Row,
  Spin,
  Table,
  message,
} from "antd";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import config from "../../config";
import getUserData from "../../api/getUserdata";
import { connect } from "react-redux";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Facture from "../../facture";
import ReactDOM from 'react-dom';
import updateUser from "../../api/updateuserdata";

const { TextArea } = Input;

function Tables({ userId, userToken }) {
  const serviceId = 'service_hsg45vc';
  const templateId = 'template_62z244c';
  const publicKey = 'xNlIK5ddauEOHUj2s';







  const generatePDF = () => {
    const factureDetails = {
      clientName: 'sd',
      total: 'sds',
    };

    const printComponent = <Facture />;
    // const printComponent = <Facture factureDetails={factureDetails} />;

    const tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    ReactDOM.render(printComponent, tempContainer);

    html2canvas(tempContainer).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save('facture.pdf');

      // Clean up: remove the temporary container and its contents
      document.body.removeChild(tempContainer);
    });
  }

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








  
  const columns = [
    {
      title: "MATRICULE",
      dataIndex: "matricule",
      key: "matricule",
      width: "32%",
    },
    {
      title: "DESTINATION",
      dataIndex: "destenaire_ville",
      key: "destenaire_ville",
    },
    {
      title: "POIDS",
      key: "poid_total",
      dataIndex: "poid_total",
      render: (text) => (
        <span>{text} kg</span>
      )
    },
    {
      title: "PRIX",
      dataIndex: "prix",
      key: "prix",
      render: (text) => (
        <span>{text}0 tnd</span>
      )
    },
    {
      title: "JOUR DE DEPART",
      dataIndex: "jour_depart",
      key: "jour_depart",
    },


    {
      title: "STATUS",
      dataIndex: "status_colis",
      key: "status_colis",
      render: (item, record) => {
        var color=""
        var icon
       if(record.status_colis === "Traitement"){
            icon = <ClockCircleOutlined />
            color= "#1677ff"
       }else if(record.status_colis === "Pré-acceptation"){

         
       
        icon = <CheckCircleOutlined/>
        color= "#fa8c16"
       }else if(record.status_colis === "Accepté"){

        icon = <CheckCircleOutlined />
        color= "#52c41a"
       }else if (record.status_colis === "Terminé"){
        icon = <CheckCircleFilled/>
        color= "#52c41a"
       }else if(record.status_colis === "En route"){
        icon = <LoadingOutlined />
        color= "#1677ff"
   }
        return (
          <>
         
          <span onClick={()=>{
            if (record.status_colis !== "Terminé") {
              setselectedRecordStatus(record)
              setIsModalOpenTable(true);
            }else{
                setselectedRecordStatus(record)
              }
          }} style={{ color: color, cursor:'pointer' }}>
            {icon} {record.status_colis}
          </span>
          </>
        )
      },
    },
    {
      title: "DETAILS",
      dataIndex: "details",
      key: "details",
      render: (text, record) => (
        <div className="ant-employed">
          <EyeFilled onClick={() => showModal(record)} />
          <SoundFilled onClick={() => showModalReclamtion(record)} />
          <FilePdfFilled onClick={generatePDF} />
          <SmileFilled onClick={()=>showModalAvis()} />
        </div>
      ),
    },
  ];

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [jour, setJour] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecordStatus, setselectedRecordStatus] = useState(null);
  const [isModalOpenTable, setIsModalOpenTable] = useState(false);
  const [isModalOpenAvis, setIsModalOpenAvis] = useState(false);
  const [isModalOpenReclamation, setIsModalOpenReclamation] = useState(false);
  const [clientData, setclientData] = useState(null);
  const [form] = Form.useForm();
  const [avis, setAvis] = useState(3);

  const handleRateChange = (value) => {
    setAvis(value);
    setIsModalOpenAvis(false);
    donnerAvis(value)
  };
  const showModalMessage = (status)=>{
    if(status=='En route'){
      return(
      <p><CheckCircleFilled style={{ color: '#52c41a'}} /> Voulez vous Terminez cet colis ?</p>

    );
    }else if (status=='Accepté'){
      return(
      <p><LoadingOutlined style={{ color: '#1677ff'}}/> Colis En Route ?</p>
    );
    }else if (status=='Pré-acceptation'){
      return(
      <p><CheckCircleOutlined  style={{ color: '#52c41a'}}/> Voulez vous Accepté cet colis ?</p>
    );
    }
    


    
  }


  const showModalAvis = (record) => {
    setIsModalOpenAvis(true);

  };

  const handleCancelAvis = () => {
    setIsModalOpenAvis(false);
  };
  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    fetchDataUser(record.client);

  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const onChangeDate = (date, dateString) => {
    setJour(dateString.toString());
    setData([]);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };










//Reclamation Modal
  const showModalReclamtion = (record) => {
    setSelectedRecord(record);
    setIsModalOpenReclamation(true);

  };




  const handleCancelReclamtion = () => {
    setIsModalOpenReclamation(false);
    // setSelectedRecord(null);
  };




//Table Modal
  const handleCancelTable = () => {
    setIsModalOpenTable(false);
  };

  const fetchData = async () => {
    setLoading(true);
    axios
      .get(config.baseUrl + "/get_colis_by_transporteur_id/" + userId, {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      })
      .then((response) => {
        const filterJour =
          jour === "" ? response.data : response.data.filter((item) => item.jour_depart === jour);
        if (filterJour) setLoading(false);
        setData(filterJour);


      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchDataUser = async (id) => {
    try {
      const result = await getUserData(id, userToken);
      setclientData(result);

    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  useEffect(() => {

    fetchData();

  }, [userId, userToken, selectedRecord ]);



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
        Authorization: `Token ${userToken}`,
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
      <div className="tabled fs-3">
        <Row className="" gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <DatePicker
              style={{ width: "94%", padding: "5px", marginRight: "7px" }}
              placeholder="Jour de départ"
              onChange={onChangeDate}
            />
            <span>
              <SecurityScanFilled style={{ fontSize: "22px" }} onClick={fetchData} />
            </span>
            <Card
              style={{ width: "94%" }}
              bordered={false}
              className="criclebox tablespace mb-24"
              extra={loading ? <Spin /> : ""}
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
      
      
      
      
    <Modal footer={[]} open={isModalOpenAvis} onCancel={handleCancelAvis} >
    <Flex  gap="middle" vertical>
    <Rate 
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



      {selectedRecord && (
        <Modal footer={[]} open={isModalOpen} onCancel={handleCancel}>


          {clientData ?(
            <>
          <h5>Détails de expéditeur</h5>
            <div  >
          <img style={{              borderRadius:'50%', width:'130px',marginBottom:'10px', height:'130px'}} src={config.baseUrl+clientData.profile_image} alt="img" />
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Nom et Prénom d'expéditeur: </span>{clientData.namelastname}</div>
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Numéro d'expéditeur: </span> {clientData.phone_number}</div>
          </div>
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
          
          <h5>Description de Colis</h5>
          <div>{selectedRecord.description}</div>
          <div
            style={{
              marginTop: "1px",
              marginBottom: "10px",
              width: "100%",
              height: "1px",
              background: "#000",
              opacity: "0.1",
            }}
          ></div>
          <h5>Détails de destenaire</h5>
          <div style={{ fontSize: "15px" }}>
            <div>
              <span style={{ fontWeight: "600" }}>Nom et Prénom de destenaire: </span>
              {selectedRecord.destenaire_nom_pre}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Numéro de destenaire: </span>
              {selectedRecord.destenaire_tel}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Ville de destenaire: </span>
              {selectedRecord.destenaire_ville}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Code postal: </span>
              {selectedRecord.destenaire_zipcode}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Adresse de destenaire: </span>
              {selectedRecord.destenaire_adresse}
            </div>
            <div>
              <span style={{ fontWeight: "600" }}>Gouvernorat de destenaire: </span>
              {selectedRecord.destenaire_Gouvernorat}
            </div>
          </div>
          </>
          ):<Spin />}
        </Modal>
      )}


      {
        selectedRecordStatus && (
          
          <Modal title="Status de colis" open={isModalOpenTable}  
          footer={[
            <Button
            onClick={handleCancelTable}
            key="1">Annuler</Button>,
            <Button
            onClick={async ()=>{
              fetchDataUser(selectedRecordStatus.client);
  
              if(clientData){
  
              
              var newStatuColis
              if (selectedRecordStatus.status_colis == "Pré-acceptation"){
                newStatuColis = 'Accepté'
              }else if (selectedRecordStatus.status_colis == "Accepté"){
                newStatuColis = 'En route'
              }else if (selectedRecordStatus.status_colis == "En route"){
                newStatuColis = 'Terminé'
              }
              console.log('clientData', clientData);
              
              axios.put(
                `${config.baseUrl}/update_colis_status/${selectedRecordStatus.id}`,
                {
                  status_colis:newStatuColis,
                  transporteur_id:userId
                },
                {
                  headers: {
                    Authorization: `Token ${userToken}`,
                  },
                }
              ).then(res => {
                //Email pour Distinaire
                const templateParamsEXP = {
                  from_name: 'Colis.tn',
                  message: 'Votre Colis avec matricule '+ selectedRecordStatus.matricule+ ' est '+ newStatuColis,
                  to_email:selectedRecordStatus.destenaire_email,
                  to_name:selectedRecordStatus.destenaire_nom_pre
                };
                  console.log('data.destenaire_email',selectedRecordStatus.destenaire_email);
                //Email pour expediteur
                const templateParams = {
                  from_name: 'Colis.tn',
                  message: 'Votre Colis avec matricule '+ selectedRecordStatus.matricule+ ' est '+ newStatuColis,
                  to_email:clientData.email,
                  to_name:clientData.namelastname
                };
                emailjs.send(serviceId, templateId, templateParams, publicKey)
                .then((response) => {
                  console.log('Email sent successfully:', response);
                  
                }, (error) => {
                  console.error('Error sending email:', error);
                
                });

                emailjs.send(serviceId, templateId, templateParamsEXP, publicKey)
                .then((response) => {
                  console.log('Email sent successfully:', response);
                  
                }, (error) => {
                  console.error('Error sending email:', error);
                
                });


                message.success('Colis '+newStatuColis);
          
              }).catch(err => {
                console.error(err);
              });
          
              setIsModalOpenTable(false);
            }
            }}
            
            key="2" type="primary">Changer Status</Button>,
            

          ]}
          
          onCancel={handleCancelTable}
          >
            
            {showModalMessage(selectedRecordStatus.status_colis)}
            
          </Modal>
        )
      }
    </div>
  );
}
const mapStateToProps = state => ({
  userId: state.user.id,
  userToken: state.user.token,
});
export default connect(mapStateToProps) (Tables);
