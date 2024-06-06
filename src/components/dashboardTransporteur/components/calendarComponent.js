import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Skeleton, Spin } from 'antd';
import axios from 'axios';
import {
  ClockCircleFilled,
  ClockCircleOutlined,
  ClockCircleTwoTone,
  EnvironmentFilled,
  EnvironmentOutlined,
  EnvironmentTwoTone,
  GoldOutlined,
  GoldTwoTone,
  GoldenFilled,
  InfoCircleFilled,
  PieChartFilled,
} from '@ant-design/icons';
import config from '../../config';
import { connect } from 'react-redux';

const CalendarComponent = ({ userId, userToken, is_calendrier_valid, data }) => {
  const [colisData, setColisData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (is_calendrier_valid) {
      fetchColisData();
    }
  }, [is_calendrier_valid, colisData]);

  const fetchColisData = async () => {

    try {
      const response = await axios.get(`${config.baseUrl}/transporteur-calendriers/${userId}/`, {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      });
      setLoading(true); 
      setColisData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getListData = (value) => {
    const filteredColis = colisData.filter(colis => colis.jour_depart === value.format('YYYY-MM-DD'));
    return filteredColis || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div>
        <ul className="events">
          {listData.map((item, index) => (
            <div key={index}>
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center'
              }}>
                <div>
                <div><span style={{ fontSize: '15px', fontWeight: "700" }}><ClockCircleOutlined /></span> <span style={{ fontSize: '14px', fontWeight: "600" }}>{item.heure_depart.replace(/:\d+:/g, ":")}h </span></div>
                <div><span style={{ fontSize: '15px', fontWeight: "700" }}><EnvironmentOutlined /></span> <span style={{ fontSize: '14px', fontWeight: "600" }}>{item.destenaire_Gouvernorat}</span></div>
                <div><span style={{ fontSize: '15px', fontWeight: "700" }}><EnvironmentOutlined /></span> <span style={{ fontSize: '14px', fontWeight: "600" }}>{item.destenaire_zipcode}</span></div>
                <div><span style={{ fontSize: '15px', fontWeight: "700" }}><GoldOutlined /></span> <span style={{ fontSize: '14px', fontWeight: "600" }}>{item.poids_disponible_jour}kg</span></div>
              </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    );
  };

  if (!is_calendrier_valid) {
    return (
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
          <InfoCircleFilled style={{ fontSize: '16px' }} />
          <span style={{ fontSize: '19px', fontWeight: '600', marginLeft: '5px' }}> Veuillez compléter le calendrier de travail </span>
        </div>
        <Calendar style={{ opacity: '.2', pointerEvents: 'none' }} />
      </div>
    );
  } else if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin />
      </div>
    );
  } else {
    return (
      <div>
        <Calendar dateCellRender={dateCellRender} />
      </div>
    );
  }
};

const mapStateToProps = state => ({
  userId: state.user ? state.user.id : null,
  userToken: state.user ? state.user.token : null,
});

export default connect(mapStateToProps)(CalendarComponent);
