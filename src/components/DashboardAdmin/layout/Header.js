import { useEffect, useState } from "react";

import { ApiFilled, NotificationFilled, SoundFilled, UserAddOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  List,
  Modal,
  Row,
  Tooltip,
  Typography,
  message
} from "antd";
import axios from 'axios';
import config from "../../config";

import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import logoutApi from "../../api/logout";











const Header =({
  userToken
})=> {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();






  const logout = async () => {
    try {
      const result = await logoutApi(userToken, navigate)

      console.log(result);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  



  return (
    <div>
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
    
        </Col>
        <Col span={24} md={18} className="header-control">
        <Col size="small" count={4} style={{cursor:'pointer'}} >
 
        <Tooltip title="Logout">

        <ApiFilled style={{marginLeft:'15px'}}  onClick={logout} />
        </Tooltip> 
 

     
          </Col>

         
        </Col>
      </Row>
    </div>
  );
}
const mapStateToProps = state => ({

  userToken: state.user ? state.user.token : null,
});

export default connect(mapStateToProps) (Header);
