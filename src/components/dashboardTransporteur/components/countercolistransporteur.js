
import RcResizeObserver from 'rc-resize-observer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { CheckCircleOutlined } from '@ant-design/icons';
import { StatisticCard } from '@ant-design/pro-components';
import { Col, Spin } from 'antd';
import { connect } from 'react-redux';
const imgStyle = {
    display: 'block',
    width: 60,
   
  };
const CounterColisTransporteur = ({userId, userToken}) => {
    const [Total, setTotal] = useState(0);
    const [Enroute, setEnroute] = useState(0);
    const [Accepté, setAccepté] = useState(0);
    const [Terminé, setTerminé] = useState(0);
    const [data, setData] = useState(null);
    const [responsive, setResponsive] = useState(false);

    useEffect(() => {
      let source = axios.CancelToken.source(); // Create a cancel token source

      const fetchColis = async () => {
          try {
              const response = await axios.get(config.baseUrl + '/get_colis_by_transporteur_id/' + userId, {
                  headers: {
                      Authorization: `Token ${userToken}`,
                  },
                  cancelToken: source.token, // Pass cancel token to the request
              });
              setData(response.data);
              setTotal(response.data.length);
              setEnroute(response.data.filter((item) => item.status_colis === 'En route').length);
              setTerminé(response.data.filter((item) => item.status_colis === 'Terminé').length);
              setAccepté(
                  response.data.filter(
                      (item) => item.status_colis === 'Accepté' || item.status_colis === 'Pré-acceptation'
                  ).length
              );
          } catch (error) {
              if (!axios.isCancel(error)) { // Check if request was cancelled
                  console.error('Erreur:', error);
                  throw error;
              }
          }
      };

      fetchColis();

      return () => {
          source.cancel('Component unmounted'); // Cancel the request when the component unmounts
      };
      }, [userToken, userId]);

    return (
      <>
<Col  xs={32} sm={24} md={32} lg={32} xl={32} className="mb-24">

{data ? (
  

<RcResizeObserver
key="resize-observer"
onResize={(offset) => {
setResponsive(offset.width < 596);
}}
>
<StatisticCard.Group direction={responsive ? 'column' : 'row'}

>
<StatisticCard
statistic={{
title: 'Total Colis',
value: Total,
icon: (
  <img
    style={imgStyle}
    src="https://cdn-icons-png.freepik.com/512/189/189666.png"
    alt="icon"
  />
),
}}
/>

<StatisticCard
statistic={{
title: 'Accepté',
value: Accepté,
icon: (
<CheckCircleOutlined color='#2abf53' style={{fontSize:'35px',color:'#2abf53'}} />
),
}}
/>
<StatisticCard
statistic={{
title: 'En Route',
value: Enroute,
icon: (
  <img
    style={imgStyle}
    src="https://p.kindpng.com/picc/s/432-4324292_shipping-icon-red-delivery-icon-png-transparent-png.png"
    alt="icon"
  />
),
}}
/>
<StatisticCard
statistic={{
title: 'Terminé',
value: Terminé,
icon: (
  <img
    style={imgStyle}
    src="https://cdn-icons-png.freepik.com/256/11043/11043262.png"
    alt="icon"
  />
),
}}
/>

</StatisticCard.Group>
</RcResizeObserver>
):(          <Col  xs={32} sm={24} md={32} lg={32} xl={32} className="mb-24">
<Spin />

</Col>  )}
</Col>
      </>
    )
 
}
const mapStateToProps = state => ({
  userId: state.user.id,
  userToken: state.user.token,
});
export default connect(mapStateToProps) (CounterColisTransporteur);
