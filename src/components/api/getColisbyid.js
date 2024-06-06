
import axios from 'axios';
import config from '../config';


const getColisbyId = async (id, token, jour) => {
  try {

    const response = await axios.get(config.baseUrl+'/get_colis_by_transporteur_id/'+id,
  
    {
      headers: {
        Authorization: `Token ${token}`, 
      },
    }
  
  );

    const data = response.data;
    const filteredColis = data.filter(item => item.jour_depart === jour);

    return filteredColis;
  } catch (error) {

    console.error('Erreur:', error);
    throw error;
  }
};

export default getColisbyId;