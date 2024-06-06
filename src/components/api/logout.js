import axios from 'axios';
import config from '../config';


const logoutApi = async (token, navigate)  =>{


    try{
      const response = await axios({
        data: {},
        method:'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: "Token " + token
      },
        url: config.baseUrl + '/logout',
      });

      localStorage.clear()
      navigate('/login')
      console.log(response.data);
    }catch(e){
      console.log(token);
      console.log("Error Logout", e);
    }
   
  }

export default logoutApi;