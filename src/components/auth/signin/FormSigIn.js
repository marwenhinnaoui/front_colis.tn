import { Navigate } from 'react-router-dom';
import '../assets/Form.css';
import logo from '../assets/authImage_.png';
import FormSignin from './Form';


const FormSin = () => {

    return (
      <>
        <div className='form-container'>
          <span className='close-btn'></span>
          <div className='form-content-left'>
            <img className='form-img' src={logo} alt='spaceship' />
          </div>
          <FormSignin />
        </div>
      </>
    );
  
  
};

export default FormSin;
