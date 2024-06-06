import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Rate,
  Row,
  Spin,
  Table,
  Tooltip,
  message,
} from "antd";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import config from "../../config";
import getUserData from "../../api/getUserdata";
import { connect } from "react-redux";
import { CheckCircleFilled, CreditCardFilled, DeleteFilled, ExclamationCircleFilled, EyeFilled, FileImageFilled, FrownOutlined, LockFilled, MehOutlined, MessageFilled, MessageOutlined, SmileOutlined, UnlockFilled } from "@ant-design/icons";
const { confirm } = Modal;
const customIcons = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};
function Homeadmin({ userId, userToken }) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "NOM PRENOM",
      dataIndex: "namelastname",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
    },
    {
      title: "AVIS",
      dataIndex: "rating",
      render: (text, record) => {
        return (
            <Rate value={record.rating} character={({ index = 0 }) => customIcons[index + 1]} />
        )
      }
    },
    {
      title: "ROLE",
      dataIndex: "role",
      render: (text, record) => {
        return (
          <p>
            {
              text == 't' ? (<p>Transporteur</p> ):(<p>Expediteur</p>)
            }
          </p>
        )
      }
    },
    {
      title: "ACTION",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <>
          {
            record.role == "t" ? (
              <>
              
              <Tooltip title="Information de transporteur">
              <EyeFilled onClick={()=>showModal(record)} style={{marginRight:'15px', cursor:'pointer'}} />
              </Tooltip>


              {
                record.compte_valid == true ?(
                  <Tooltip title="Blocage transporteur">

                  <LockFilled onClick={()=>blocage_utilisateur(record.id)} style={{marginRight:'15px', cursor:'pointer'}} />
                  </Tooltip>
                ):(<Tooltip title="Deblocage  de transporteur">

                <UnlockFilled onClick={()=>deblocage_utilisateur(record.id)} style={{marginRight:'15px', cursor:'pointer'}} />
                </Tooltip>)
              }


              <Tooltip title="Reçus de paiemenet">

              <CreditCardFilled onClick={()=>showModalReçus(record.reçus_paiement)} style={{marginRight:'15px', cursor:'pointer'}} />
              </Tooltip>

              <Tooltip title="Documents de transporteur">

              <FileImageFilled onClick={()=>showModalDocument(record)} style={{marginRight:'15px', cursor:'pointer'}} />
              </Tooltip>
              <Tooltip title="Effacé transporteur">
              <DeleteFilled onClick={()=>EffaceUtilisateur(record.id)} style={{marginRight:'15px',cursor:'pointer',color:'#ff4d4f'}} />
              </Tooltip>
              {
                  record.valid_paiement == false ? (
                    <Tooltip title="Accepté transporteur">
                    <CheckCircleFilled onClick={()=> AcceptTranspoteur(record.id)}  style={{ cursor:'pointer', color:'#52c41a'}} />
                    </Tooltip>
                  ):(<></>)

              }
            </>
          )
          :(
            <>
             <Tooltip title="Information de transporteur">
              <EyeFilled onClick={()=>showModal(record)} style={{marginRight:'15px', cursor:'pointer'}} />
              </Tooltip>
              {
                record.compte_valid == true ?(
                  <Tooltip title="Blocage transporteur">

                  <LockFilled onClick={()=>blocage_utilisateur(record.id)} style={{marginRight:'15px', cursor:'pointer'}} />
                  </Tooltip>
                ):(<Tooltip title="Deblocage  de transporteur">

                <UnlockFilled onClick={()=>deblocage_utilisateur(record.id)} style={{marginRight:'15px', cursor:'pointer'}} />
                </Tooltip>)
              }

              <Tooltip title="Documents de transporteur">

              <FileImageFilled onClick={()=>showModalDocument(record)} style={{marginRight:'15px', cursor:'pointer'}} />
              </Tooltip>
              <Tooltip title="Effacé transporteur">
              <DeleteFilled onClick={()=>EffaceUtilisateur(record.id)} style={{cursor:'pointer',color:'#ff4d4f'}} />
              </Tooltip>
            </>
          )
          }
          </>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [record, setRecord] = useState(null);
  const [recordReçus, setRecordReçus] = useState(null);
  const [recordDocument, setrecordDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenReçus, setIsModalOpenReçus] = useState(false);
  const [isModalOpenDocument, setIsModalDocument] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState([]);


  const AcceptTranspoteur = async(id)=>{
    confirm({
      title: 'Acceptation de transporteur',
      icon: <CheckCircleFilled style={{ color:'#52c41a'}}  />,

      onOk() {
        axios.put(
          `${config.baseUrl}/accepte_user/${id}`,

          {
            headers: {
              Authorization: `Token ${userToken}`,
            },
          }
        ).then(res => {

          message.success('Transporteur Accepté!');

        }).catch(err => {
          console.error(err);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }



  const blocage_utilisateur = async(id)=>{
    confirm({
      title: 'Blocage de transporteur',
      icon: <LockFilled style={{ color:'#ff4d4f'}}  />,

      onOk() {
        axios.put(
          `${config.baseUrl}/blocage_utilisateur/${id}`,

          {
            headers: {
              Authorization: `Token ${userToken}`,
            },
          }
        ).then(res => {

          message.success('Blocage réussie!');
    
        }).catch(err => {
          console.error(err);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }



  const deblocage_utilisateur = async(id)=>{
    confirm({
      title: 'Deblocage de transporteur',
      icon: <UnlockFilled style={{ color:'#52c41a'}}  />,

      onOk() {
        axios.put(
          `${config.baseUrl}/deblocage_utilisateur/${id}`,

          {
            headers: {
              Authorization: `Token ${userToken}`,
            },
          }
        ).then(res => {

          message.success('Deblocage réussie!');
    
        }).catch(err => {
          console.error(err);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }




  const EffaceUtilisateur = async(id)=>{
    confirm({
      title: 'Effacé Utilisateur',
      icon: <DeleteFilled style={{color:'#ff4d4f'}}/>,

      onOk() {
        axios.delete(
          `${config.baseUrl}/delete/${id}`,

          {
            headers: {
              Authorization: `Token ${userToken}`,
            },
          }
        ).then(res => {

          message.success('Utilisateur Effacé!');
    
        }).catch(err => {
          console.error(err);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  const showModal = async (rec) => {

    console.log('record', rec);
    setIsModalOpen(true);
    setRecord(rec);
    try {
      const result = await getUserData(userId, userToken);
      setUserData(result);

    } catch (error) {
      console.error('Erreur:', error);
    } 
  };




  const showModalReçus = async(record)=>{
    setRecordReçus(record)
    setIsModalOpenReçus(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false);
    setRecord(null);
  };
  const handleCancelReçus = () => {
    setIsModalOpenReçus(false);
    setRecordReçus(null);
  };
  

  const showModalDocument = async(record)=>{
    setrecordDocument(record)
    setIsModalDocument(true)
  }
  const handleCancelDocument = () => {
    setIsModalDocument(false);
    setrecordDocument(null);
  };


  useEffect(() => {
    axios
      .get(`${config.baseUrl}/get_all_users`, {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId, userToken, data, record]);

  return (
    <Main>
      <div className="tabled fs-3">
        <Row className="" gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              style={{ width: "94%" }}
              bordered={false}
              className="criclebox tablespace mb-24"
              extra={loading ? <Spin /> : ""}
              title="Tous les Utilisateurs"
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
            {
              record ?(
                <Modal footer={[]} open={isModalOpen} onCancel={handleCancel}>


                {
                  record.role == 't' ?(<>
                  <div style={{marginTop:'30px',marginBottom:'30px', width:'180px', height:'180px', borderRadius:'50%', overflow:'hidden'}}>
                        <img

                        src={config.baseUrl+record.profile_image} alt='image' />
                        </div>                    <p style={{fontSize:'14.5px'}}><b>Nom et prénom:</b> {record.namelastname}</p>
                    <p style={{fontSize:'14.5px'}}><b>Numéro télephone:</b> {record.phone_number}</p>
                    <p style={{fontSize:'14.5px'}}><b>Email:</b> {record.email}</p>
                    <p style={{fontSize:'14.5px'}}><b>Marque de vehicule:</b> {record.marque_vehicule}</p>
                    <p style={{fontSize:'14.5px'}}><b>Matricule de vehicule:</b> {record.matricule_vehicule}</p>
                    <p style={{fontSize:'14.5px'}}><b>Tonnage de vehicule:</b> {record.tonnage_vehicule}</p>
                    <p style={{fontSize:'14.5px'}}><b>Ville:</b> {record.city}</p>
                    <p style={{fontSize:'14.5px'}}><b>Code postal:</b> {record.zip_code}</p>
                    <p style={{fontSize:'14.5px'}}><b>Adresse:</b> {record.billing_address}</p>

                  </>):
                    
                  (<>exp</>)
                }
              </Modal>
              ):(
<></>
              )
            }


            
            {
              recordReçus ?(
                <Modal footer={[]} open={isModalOpenReçus} onCancel={handleCancelReçus}>
                  <div style={{margin:'auto', textAlign:'center'}}>
                  <Image
                    width={200}
                    src={config.baseUrl+recordReçus}
                  />
                  <p style={{ textAlign: 'center', fontWeight:'bold' }}>Reçus de paiement</p>
                </div>
              </Modal>
              ):(
<></>
              )
            }
            {
              recordDocument ?(
                <Modal footer={[]} open={isModalOpenDocument} onCancel={handleCancelDocument}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' , justifyContent:'space-around'}}>
                            <div >
                              <Image
                                width={200}
                                src={config.baseUrl+recordDocument.image_cin_recto}
                              />
                              <p style={{ textAlign: 'center',fontWeight:'bold' }}>Carte CIN (Recto)</p>
                            </div>
                            <div >
                              <Image
                                width={200}
                                src={config.baseUrl+recordDocument.image_cin_verso}
                              />
                              <p style={{ textAlign: 'center',fontWeight:'bold' }}>Carte CIN (Verso)</p>
                            </div>
                            <div >
                              <Image
                                width={200}
                                src={config.baseUrl+recordDocument.image_permi_recto}
                              />
                              <p style={{ textAlign: 'center',fontWeight:'bold' }}>Carte Grise (Recto)</p>
                            </div>
                            <div >
                              <Image
                                width={200}
                                src={config.baseUrl+recordDocument.image_permi_verso}
                              />
                              <p style={{ textAlign: 'center',fontWeight:'bold' }}>Carte Grise (Recto)</p>
                            </div>
                            <div >
                              <Image
                                width={200}
                                src={config.baseUrl+recordDocument.image_carte_grise_recto}
                              />
                              <p style={{ textAlign: 'center' , fontWeight:'bold' }}>Permis (Recto)</p>
                            </div>
                            <div >
                              <Image
                                width={200}
                                src={config.baseUrl+recordDocument.image_carte_grise_verso}
                              />
                              <p style={{ textAlign: 'center', fontWeight:'bold' }}>Permis (Verso)</p>
                            </div>
                            {/* Add more images with text here */}
                    </div>
              </Modal>
              ):(
<></>
              )
            }

          </Col>
        </Row>
      </div>
    </Main>
  );
}

const mapStateToProps = (state) => ({
  userId: state.user.id,
  userToken: state.user.token,
});

export default connect(mapStateToProps)(Homeadmin);
