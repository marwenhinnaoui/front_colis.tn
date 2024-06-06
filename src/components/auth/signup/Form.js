import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Form.css';
import logo from '../assets/authImage_.png';
import FormSignup from './FormSignup';
const Form = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate =useNavigate()
  function submitForm() {
    setIsSubmitted(true);
  }
  const redirect=_=>{
    setTimeout(() => {
      navigate("/login");
  }, 1000);
  }
  return (
    <>
      <div className='form-container'>
        <span className='close-btn'></span>
        <div className='form-content-left'>
          <img className='form-img' src={logo} alt='spaceship' />
        </div>

          <FormSignup style={{overflowX:'scroll'}} />
        
      </div>
    </>
  );
};

export default Form;
