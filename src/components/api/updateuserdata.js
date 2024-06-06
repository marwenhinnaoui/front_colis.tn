import axios from 'axios';
import config from '../config';

const updateUser = async (id, userData, token) => {
  try {
    const response = await axios.put(
      `${config.baseUrl}/update/${id}`,
      userData,
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',

        },
      }
    );

    const updatedUser = response.data;
    return updatedUser;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

export default updateUser;
