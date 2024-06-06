import React, { useEffect, useState } from "react";
import { ApiFilled, CheckCircleFilled, NotificationFilled, SoundFilled } from "@ant-design/icons";
import { Avatar, Badge, Col, Dropdown, List, Modal, Row, Tooltip, Typography } from "antd";
import axios from 'axios';
import config from "../../config";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import logoutApi from "../../api/logout";

const Header = ({
  userId,
  userToken
}) => {
  const navigate = useNavigate();
  const [dataReclamation, setdataReclamation] = useState([]);
  const [isModalOpenReclamation, setIsModalOpenReclamation] = useState(false);
  const [show, setShow] = useState(false);
  const [previousDataReclamationLength, setPreviousDataReclamationLength] = useState(0);

  useEffect(() => {
    axios.get(
      config.baseUrl+'/get_reclamation'+'/'+userId,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      }
    ).then(response => {
      const filterData = response.data.filter((item) => item.reponse !== "non")
      setdataReclamation(filterData);
      if (dataReclamation.length > 0 && dataReclamation.length > previousDataReclamationLength) {
        setShow(true);
      }
    }).catch(error => {
      console.log(error);
    });
  }, [userId, userToken, dataReclamation]);



  useEffect(() => {
    setPreviousDataReclamationLength(dataReclamation.length);
  }, [dataReclamation]);

  const showModalReclamtion = (record) => {
    setIsModalOpenReclamation(true);
  };

  const handleOkReclamtion = () => {
    setIsModalOpenReclamation(false);
  };

  const handleCancelReclamtion = () => {
    setIsModalOpenReclamation(false);
  };

  const logout = async () => {
    try {
      const result = await logoutApi(userToken, navigate);
      console.log(result);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <Row gutter={[24, 0]}>
        <Modal footer={[]} open={isModalOpenReclamation} onCancel={handleCancelReclamtion} >
          
        <List
                        style={{width:"100%"}}
                      itemLayout="horizontal"
                      dataSource={dataReclamation}
                      renderItem={(item, index) => (
               
                        <List.Item>
  <List.Item.Meta
    avatar={<><h4 style={{margin:'0px', textAlign:'center'}}>{item.date_reclamation.slice(-2)}</h4><p>{item.date_reclamation.slice(0, -3)}</p></>}
    title={item.sujet}
    description={
      <>
        <p style={{marginBottom:'8px'}}>{item.description}</p> 
        {item.reponse !== "" && (
          <span>
            <CheckCircleFilled style={{color:'#52c41a'}} />
            <span style={{margin:'0px', fontWeight:'600', color:'#000'}}> Reponse</span>
          </span>
        )}
        {item.reponse !== "" && <p style={{margin:'0px'}}> {item.reponse}</p>}
        <div
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              width: "100%",
              height: "1px",
              background: "#000",
              opacity: "0.1",
            }}
          ></div>
      </>
    }
  />
</List.Item>

                      )}
                    />
        </Modal>
        <Col span={24} md={6}>
          <Tooltip title="Réclamation">
            <Badge dot={show}>
              <SoundFilled onClick={showModalReclamtion} style={{cursor:'pointer', fontSize:'19px'}}  />
            </Badge>
          </Tooltip>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Col size="small" count={4} style={{cursor:'pointer'}} onClick={logout}>
            <Tooltip title="Logout">
              <ApiFilled />
            </Tooltip>
          </Col>
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = state => ({
  userId: state.user ? state.user.id : null,
  userToken: state.user ? state.user.token : null,
});

export default connect(mapStateToProps)(Header);
