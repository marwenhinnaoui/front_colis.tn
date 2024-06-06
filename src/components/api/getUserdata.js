
import axios from 'axios';
import config from '../config';


const getUserData = async (id, token) => {
  try {

    const response = await axios.get(config.baseUrl+'/users/'+id,
  
    {
      headers: {
        Authorization: `Token ${token}`, 
      },
    }
  
  );

    const data = response.data;

    return data;
  } catch (error) {

    console.error('Erreur:', error);
    throw error;
  }
};

export default getUserData;