import { useEffect, useState } from "react";
import { ApiFilled, EnvironmentOutlined, DollarOutlined, GoldOutlined, NotificationFilled, SoundFilled, CheckCircleFilled } from "@ant-design/icons";
import {  Spin,Avatar,Badge, Col, Dropdown, Menu, List, Row, Tooltip, Modal } from "antd";
import axios from 'axios';
import config from "../../config";
import { useNavigate } from "react-router-dom";
import logoutApi from "../../api/logout";
import { connect } from "react-redux";
import DetailColis from '../components/detailsColis';
import { updateNotificationLength } from "../../../store/actions";


const notificationIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      d="M10 2C6.68632 2 4.00003 4.68629 4.00003 8V11.5858L3.29292 12.2929C3.00692 12.5789 2.92137 13.009 3.07615 13.3827C3.23093 13.7564 3.59557 14 4.00003 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0787 13.009 16.9931 12.5789 16.7071 12.2929L16 11.5858V8C16 4.68629 13.3137 2 10 2Z"
      fill="#111827"
    ></path>
    <path
      d="M10 18C8.34315 18 7 16.6569 7 15H13C13 16.6569 11.6569 18 10 18Z"
      fill="#111827"
    ></path>
  </svg>
);

const Header = ({
  userId,
  userToken,


}) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataReclamation, setdataReclamation] = useState([]);
  const [todayDate, setTodayDate] = useState('');
  const [isModalOpenReclamation, setIsModalOpenReclamation] = useState(false);
  const [previousDataReclamationLength, setPreviousDataReclamationLength] = useState(0);
  const [previousDataNotificationLength, setPreviousDataNotificationLength] = useState(0);
  const [show, setShow] = useState(false);
  const [showReclamation, setShowReclamation] = useState(false);

  
  useEffect(() => {
    setPreviousDataReclamationLength(dataReclamation.length);
  }, []);

  
  useEffect(() => {
    setPreviousDataNotificationLength(data.length);
  }, [data]);

  useEffect(() => {
    const todaysDate = new Date();
    const formattedDate = `${todaysDate.getFullYear()}-${(todaysDate.getMonth() + 1).toString().padStart(2, '0')}-${todaysDate.getDate().toString().padStart(2, '0')}`;
    setTodayDate(formattedDate);
    
      
    axios.get(
      config.baseUrl+'/get_colis_compare'+'/'+userId,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      }
    ).then(response => {
      const newNotifications = response.data.filter(item => item.creation_date === formattedDate);

      setData(newNotifications);

      if (data.length > 0 && data.length > previousDataNotificationLength) {
        setShow(true);
      }

  

    }).catch(error => {
      console.log(error);
    });




    axios.get(
      config.baseUrl+'/get_reclamation'+'/'+userId
      ,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      }
    ).then(response => {
      const filterData = response.data.filter((item)=> item.reponse !== "non")
      setdataReclamation(filterData)

      if (dataReclamation.length > 0 && dataReclamation.length > previousDataReclamationLength) {
        setShowReclamation(true);
      }

    }).catch(error => {
      console.log(error);
    });
  }, [userId, userToken, data]);
  









  const menu = (
    <Menu 
      style={{ background:"#fff", padding:'0px',width: "auto", boxShadow: "0 20px 27px rgb(0 0 0 / 5%)" }}
    >
      <List
        style={{padding:'0px',}}
        className="header-notifications-dropdown "
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <>
            <Menu.Item 
              style={{width:'100%', background:'#fff',display:'flex' }}
              key={item.id}
            >
              <span style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                
              <div style={{width:'100%',background:'#fff'}} >
                <p style={{ fontWeight: "600", marginBottom: '5px' }}><EnvironmentOutlined /> {item.destenaire_ville}</p>
                <p style={{ fontWeight: "500" , marginBottom: '5px' }}><DollarOutlined /> {item.prix} tnd</p>
                <p style={{ fontWeight: "500", marginBottom: '0px'  }}><GoldOutlined /> {item.poid_total} kg</p>
              </div>
              <DetailColis userId={userId} userToken={userToken} colis={item} />
              </span>

            </Menu.Item>
            
            <div style={{marginTop: '1px',  width:'100%', height: '1px', background: '#000', opacity: '0.1' }}></div>
          </>
        )}
      />
    </Menu>
  );

  const logout = async () => {
    try {
      const result = await logoutApi(userToken, navigate);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };


  


  //Reclamation Modal
  const showModalReclamtion = (record) => {

    setIsModalOpenReclamation(true);


  };

  const handleOkReclamtion = () => {
    setIsModalOpenReclamation(false);
  };


  const handleCancelReclamtion = () => {
    setIsModalOpenReclamation(false);
  };

  return (
    <div>
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
      
      
      
      
      
      <Row gutter={[24, 0]}>
        <Col   span={24} md={6}>
        <Tooltip title="Réclamation">
        <Badge dot={showReclamation}>
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
          
          <Badge dot={show}>
            <Dropdown overlay={menu}  trigger={["click"]} >
              <a
                href=""
                className="ant-dropdown-link"
                        onClick={(e)=>e.preventDefault()}
              >
                <Tooltip title="Notification">

                {notificationIcon}
                </Tooltip>
              </a>
            </Dropdown>
          </Badge>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = state => {

  return {
    userId: state.user ? state.user.id : null,
    userToken: state.user ? state.user.token : null,
  };
};



export default connect(mapStateToProps)(Header);
