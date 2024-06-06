import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
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
import { EyeFilled, MessageFilled, MessageOutlined } from "@ant-design/icons";
const { TextArea } = Input;

function Reclamation({ userId, userToken }) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "SUJET",
      dataIndex: "sujet",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
    },
    {
      title: "ACTION",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <>
          {
            record.reponse =="" ? (
              <MessageFilled
              onClick={() => showModal(record)}
              style={{ cursor: "pointer" , marginRight:'15px'}}
              />
            ): (<></>)
        
          }
          <EyeFilled
            onClick={() => showModalDetails(record)}
            style={{ cursor: "pointer" , marginRight:'15px'}}
          />
          {/* <EyeFilled onClick={() => showModalDetails(record)} /> */}
          </>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [defendeur, setDef] = useState([]);
  const [reclamant, setReclamant] = useState([]);
  const [record, setRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDetails, setIsModalOpenDetails] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log('recordId', record.id);
    console.log('data.colis_id', record.colis);
    console.log('reclamant.reclamant', record.reclamant);
    const { reponse } = values;
    console.log(data[0]);
    try {
      const response = await axios.put(
        `${config.baseUrl}/update_reclamation/${record.id}`,
        { reponse},
   
      );
      if(response.data){

        message.success("Reponse Envoyée");
        setIsModalOpen(false);
        setRecord(null);
      }
    } catch (error) {
      message.error("Erreur Reponse!");
    }
  };
  const fetchDataReclamant = async (id,token) => {
    try {
      const result = await getUserData(id, token);
      setReclamant(result);
      console.log();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  const fetchDataDef = async (id,token) => {
    try {
      const result = await getUserData(id, token);
      setDef(result);
      console.log(result); 
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  const showModal = (rec) => {

    console.log('record', rec);
    setIsModalOpen(true);
    setRecord(rec);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRecord(null);
  };
  const showModalDetails = (rec) => {

    console.log('record', rec);
    setIsModalOpenDetails(true);
    setRecord(rec);
    fetchDataReclamant(rec.reclamant, userToken)
    fetchDataDef(rec.defendeur, userToken)
    
  };

  const handleModalDetails = () => {
    setIsModalOpenDetails(false);
    setRecord(null);
  };

  useEffect(() => {
    axios
      .get(`${config.baseUrl}/get_all_reclamations`, {
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
  }, [userId, userToken, data]);

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
              title="Tous les récalamtion"
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

data ? (
  <Modal footer={[]} open={isModalOpen} onCancel={handleCancel}>
  <Form
    form={form}
    style={{ margin: "auto", width: "100%", paddingTop: "30px" }}
    onFinish={onFinish}
  >
    <Form.Item
      name="reponse"
      rules={[
        {
          required: true,
          message: "Entrez la reponse de réclamation!",
        },
      ]}
    >
      <TextArea
        size="small"
        placeholder="Reponse de réclamation"
      />
    </Form.Item>
    <Form.Item>
      <Button
        style={{
          lineHeight: "0px",
          height: "35px",
          marginTop: "10px",
        }}
        type="primary"
        htmlType="submit"
      >
        Envoyé Reponse
      </Button>
    </Form.Item>
  </Form>
</Modal>

):(<Spin />)
}





  <Modal footer={[]} open={isModalOpenDetails} onCancel={handleModalDetails}>
{

data && reclamant && defendeur  ? (
  <>
        <h5>Détails de Reclamant</h5>
            <div  >
          <img style={{borderRadius:'50%', width:'130px',marginBottom:'10px', height:'130px'}} src={config.baseUrl+reclamant.profile_image} alt="img" />
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Nom et Prénom de Reclamant: </span>{reclamant.namelastname}</div>
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Numéro de Reclamant: </span> {reclamant.phone_number}</div>
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
                  <h5>Détails de Defendeur</h5>
            <div  >
          <img style={{borderRadius:'50%', width:'130px',marginBottom:'10px', height:'130px'}} src={config.baseUrl+defendeur.profile_image} alt="img" />
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Nom et Prénom de Reclamant: </span>{defendeur.namelastname}</div>
          <div><span style={{fontWeight:'600', fontSize: "15px"}}>Numéro de Reclamant: </span> {defendeur.phone_number}</div>
          </div>
          {/* <h5>Description de Colis</h5>
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
          ></div> */}
          </>
        ):(<Spin />)
      }
</Modal>



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

export default connect(mapStateToProps)(Reclamation);
