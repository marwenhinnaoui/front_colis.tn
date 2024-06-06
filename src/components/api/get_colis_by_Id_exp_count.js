
import axios from 'axios';
import config from '../config';


const getColisbyIdexpcount = async (id, token) => {
  var data = {
  }
  var Terminé=0
  var Total=0
  var Encours=0
  try {

    const response = await axios.get(config.baseUrl+'/get_colis/'+id,
  
    {
      headers: {
        Authorization: `Token ${token}`, 
      },
    }
  
  );
  Total = response.data.length
  console.log('Total', Total);
    return response.data;
  } catch (error) {

    console.error('Erreur:', error);
    throw error;
  }
};

export default getColisbyIdexpcount;