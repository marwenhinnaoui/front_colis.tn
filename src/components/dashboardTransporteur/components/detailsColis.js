import React, { useState } from 'react';
import { Button, Image, Modal, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import config from '../../config';
import axios from 'axios';

const DetailColis = ({ userId, colis, userToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    axios
      .put(
        `${config.baseUrl}/update_colis_status/${colis.id}`,
        {
          status_colis: 'Pré-acceptation',
          transporteur_id: userId,
        },
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
        }
      )
      .then((res) => {
        message.success('Colis ajouté dans votre journée de travail!');
      })
      .catch((err) => {
        console.error(err);
      });

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const renderArticles = () => {
    const articles = JSON.parse(colis.list_article_json);
  
    return articles.map((article, index) => (
      <div key={index}>
        <h4>{article.nom_article}</h4>
        <div><span style={{ fontWeight: '700', fontSize: '15px' }}>Description de l'article: </span>{article.description_article}</div>
        <div><span style={{ fontWeight: '700', fontSize: '15px' }}>Poids de l'article: </span>{article.poid_article}kg</div>
        <div>
          <span style={{ fontWeight: '700', fontSize: '15px', marginBottom:'15px' }}>Images de l'article: </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center' }}>
            {article.imageListArticle.map((image, imgIndex) => (
              <div key={imgIndex} style={{ marginRight: '5px', marginBottom: '5px' }}>
                <Image width={200} src={config.baseUrl+'/media/uploads/'+image} style={{ marginBottom: '5px' }} />
              </div>
            ))}
          </div>
        </div>
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
      </div>
    ));
  };

  return (
    <>
      <div style={{ cursor: 'pointer' }} type="primary" onClick={showModal}>
        <EyeOutlined style={{ fontSize: '16px' }} />
      </div>
      <Modal
        footer={[
          <Button type="primary" style={{ background: '#2bb673' }} onClick={handleOk} key="1">
            Pré-acceptation
          </Button>,
        ]}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <h5>Détails de Colis</h5>
        <div style={{ marginTop: '10px', marginBottom: '10px', width: '100%', height: '1px', background: '#000', opacity: '0.1' }}></div>
        <div>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>Matricule de colis: </span>
          {colis.matricule}
        </div>
        <div>
          <span style={{ fontWeight: '600700', fontSize: '15px' }}>Description de colis: </span>
          {colis.description}
        </div>
        <div>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>Ville de destination: </span>
          {colis.destenaire_ville}
        </div>
        <div>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>Gouvernorat: </span>
          {colis.destenaire_Gouvernorat}
        </div>
        <div>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>Jour de depart: </span>
          {colis.jour_depart}
        </div>
        <div>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>Prix de colis: </span>
          {colis.prix}tnd
        </div>
        <div>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>Poids de colis: </span>
          {colis.poid_total}kg
        </div>
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
        {renderArticles()}
      </Modal>
    </>
  );
};

export default DetailColis;
