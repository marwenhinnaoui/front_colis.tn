
import {
  Col,
  Alert,

} from "antd";

import { useState, useEffect } from 'react';
import Main from "../layout/Main";
import getUserData from '../../api/getUserdata';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Tables from '../components/Tables';
import { CheckCircleFilled } from '@ant-design/icons';

import Countercolistransporteur from '../components/countercolistransporteur';



const  HomeTransporteur = ({userId, userToken}) =>{
  const [data, setData] = useState(null);
  const [colisData, setColisData] = useState(null);


  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserData(userId, userToken);

        setData(result);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchData();
 


  }, [ data, colisData, userToken, userId ]);
  





    
  
  return (
    <Main>
      
      <div>
        <div style={{marginBottom:'20px'}}>
      {
          data && !data.is_calendrier_valid ? (
            <Link style={{textDecoration:'none', marginBottom:'30px'}} to="/transporteur/calendrier">
      <Alert
      message="Veuillez compléter le calendrier de travail"
      type="warning"
      showIcon

    />
    </Link>
          ):(<></>)
        }
   </div>
      <Col  xs={32} sm={24} md={32} lg={32} xl={32} className="mb-24">

        <Countercolistransporteur />
      </Col>
<div style={{ margin:'50px auto 10px auto'}}>
<p style={{fontSize:'19px', fontWeight:'600', }}> <CheckCircleFilled style={{color:'#52c41a'}} /> Colis Acceptée</p>

       <Tables  />
</div>
          </div>
          
          </Main>
 
  );

}
const mapStateToProps = state => ({
  userId: state.user.id,
  userToken: state.user.token,
});

export default connect(mapStateToProps)(HomeTransporteur) ;
