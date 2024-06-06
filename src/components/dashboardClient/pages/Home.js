
import { StatisticCard } from '@ant-design/pro-components';
import {
  Col,
  Spin,
  Typography
} from "antd";
import RcResizeObserver from 'rc-resize-observer';
import { useEffect, useState } from 'react';
import Main from "../layout/Main";
import Tables from '../components/Tables';
import { connect } from 'react-redux';
import config from '../../config';
import axios from 'axios';
import { CheckCircleOutlined } from '@ant-design/icons';
import CounterColis from '../components/counterColis';



const Home = ({ userId, userToken  }) => {
  const [responsive, setResponsive] = useState(false);




  return (
    <Main>
          
          <CounterColis />
          <Col xs={32} sm={24} md={32} lg={32} xl={32}>
            <Tables  />
          
          </Col>
          
          </Main>
 
  );
}
const mapStateToProps = state => ({
  userId: state.user.id,
  userToken: state.user.token,
});

export default connect(mapStateToProps)(Home) ;
