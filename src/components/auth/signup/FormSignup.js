
import { DownOutlined, EyeInvisibleOutlined, EyeTwoTone, FieldNumberOutlined, GoldFilled, HomeOutlined, IdcardFilled, MailOutlined, NumberOutlined, PhoneOutlined, PlusOutlined, TruckFilled, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, DatePicker, Dropdown, Form, Input, InputNumber, Modal, Space, Upload, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import "../../styles/main.css";
import "../../styles/responsive.css";

const FormSignup = () => {
  const  navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("Choix type de compte");
  const [dateNaissance, setDate] = useState('');
  const [image_cin_recto, setimage_cin_recto] = useState(null);
  const [image_cin_verso, setimage_cin_verso] = useState(null);
  const [image_permi_recto, setimage_permi_recto] = useState(null);
  const [image_permi_verso, setimage_permi_verso] = useState(null);
  const [image_carte_grise_recto, setimage_carte_grise_recto] = useState(null);
  const [image_carte_grise_verso, setimage_carte_grise_verso] = useState(null);
  const [reçus_paiement, setreçus_paiement] = useState(null);
  const [profile_image, setprofile_image] = useState(null);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const items = [
    {
      label: 'Transporteur',
      key: '1',
    },
    {
      label: 'Client',
      key: '2',
    },
  ];
  const handleChangeInput = (e) => {
    console.log('e.target.name', e.target.name);
    console.log('e.target.files[0]', e.target.files[0]);
    switch (e.target.name) {
      case "image_cin_recto":
        setimage_cin_recto(e.target.files[0]);
        break;
      case "image_cin_verso":
        setimage_cin_verso(e.target.files[0]);
        break;
      case "image_permi_recto":
        setimage_permi_recto(e.target.files[0]);
        break;
      case "image_permi_verso":
        setimage_permi_verso(e.target.files[0]);
        break;
      case "image_carte_grise_recto":
        setimage_carte_grise_recto(e.target.files[0]);
        break;
      case "image_carte_grise_verso":
        setimage_carte_grise_verso(e.target.files[0]);
        break;
      case "profile_image":
        setprofile_image(e.target.files[0]);
        break;
      case "reçus_paiement":
        setreçus_paiement(e.target.files[0]);
        break;
      default:
        break;
    }
  };
  
  const handleMenuClick = (e) => {
    if (e.key === '1') {
      setAccountType("Transporteur");
    } else if (e.key === '2') {
      setAccountType("Client");
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const onChangeDate = (date, dateString) => {
    setDate(dateString.toString());
    console.log(dateString.toString());
  };




  const onfinish = async (values) => {
    var role = '';
    var valid_paiement = false;

    values['role'] = accountType;
    values['zip_code'] = Number(values['zip_code']);
    values['cin'] = Number(values['cin']);
    values['phone_number'] = Number(values['phone_number']);
    values['date_naissance'] = dateNaissance;
    values['billing_address'] = values['billing_address'];

    accountType == "Client" ? role = 'c' : role = "t"
    values['role'] = role;
    values['tonnage_vehicule']=Number(values['tonnage_vehicule'])
    console.log(values['tonnage_vehicule']);
    values['marque_vehicule']=values['marque_vehicule']
    values['matricule_vehicule']=values['matricule_vehicule']
    if(values['role'] == 'c'){
      values['tonnage_vehicule']=0
      values['marque_vehicule']=''
      values['matricule_vehicule']=''

      setimage_permi_recto(image_cin_recto);

      setimage_permi_verso(image_cin_recto);
  
      setimage_carte_grise_recto(image_cin_recto);
  
      setimage_carte_grise_verso(image_cin_recto);
  
      setreçus_paiement(image_cin_recto);

    }


    values ={ ...values, username:values['email']}
    values ={ ...values, image_cin_recto: image_cin_recto}
    values ={ ...values, image_cin_verso: image_cin_verso}
    values ={ ...values, image_carte_grise_recto: image_carte_grise_recto}
    values ={ ...values, image_carte_grise_verso: image_carte_grise_verso}
    values ={ ...values, image_permi_recto: image_permi_recto}
    values ={ ...values, image_permi_verso: image_permi_verso}
    values ={ ...values, profile_image: profile_image}
    values ={ ...values, reçus_paiement: reçus_paiement}
    values ={ ...values, valid_paiement: valid_paiement}
    values ={ ...values, compte_valid: true}
    console.log(values);
    try {
      const response = await axios({
        headers: {
          'Authorization': '',
          'Content-Type': 'multipart/form-data',
        },
        url: `${config.baseUrl}/signup`,
        data: values,
        method: 'POST'
      });
      console.log(response);
      if(role == "t"){
        message.success('Compte créé et tu va binetot reçevoir un email contient le mot de passe!');

      }else if(role == "c"){
        message.success('Compte créé avec succès!');
      }
      navigate('/login')
    } catch (error) {
      console.error('Error:', error);
      message.error("Une erreur s'est produite lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{overflowX:'scroll'}}>
    <Form
     encType="multipart/form-data"
        name="normal_login"
        className="login-form was-validated"
        initialValues={{ remember: true }}
        onFinish={onfinish}
        style={{width:'70%' , margin:'auto', padding:'15px'}}
        size='small'
    >
      
        <Form.Item
            name="namelastname"
            rules={[{ required: true, message: 'Entrez Nom et Prénom! !' }]}
        >

            
            <Input  prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nom et Prénom" />
        </Form.Item>
        

        <Form.Item
            name="email"
            rules={[
                { required: true, message: 'Entrez Email!' },
                { type: 'email', message: 'Email invalide!' }
            ]}
        >

            
            <Input  prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>


        <Form.Item
            name="phone_number"
            rules={[
                { required: true, message: 'Entrez votre numéro de téléphone!' },
                { pattern: /^\d{8}$/, message: 'Le numéro de téléphone doit être composé de 8 chiffres.' }
            ]}
        >

            
            <Input  prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Numéro de téléphone" />
        </Form.Item>


        <Form.Item
            name="date_naissance"
            rules={[{ required: true, message: 'Entrez votre date de naissance!' }]}
            
        > 
        <DatePicker  
        
        style={{width:'100%', padding:'10px'}}
        
        placeholder='Date de naissance'  onChange={onChangeDate} />
        </Form.Item>

        <Form.Item
            name="billing_address"
            rules={[{ required: true, message: 'Entrez votre adresse!' }]}
        >

            
            <Input  prefix={<HomeOutlined className="site-form-item-icon" />} placeholder="Adresse" />
        </Form.Item>



        <Form.Item
            name="city"
            rules={[{ required: true, message: 'Entrez votre ville!!' }]}
        >

            
            <Input  prefix={<HomeOutlined className="site-form-item-icon" />} placeholder="Ville" />
        </Form.Item>

        <Form.Item
            name="zip_code"
            rules={[
                { required: true, message: 'Entrez votre Code postal!' },
                { pattern: /^\d{4}$/, message: 'Le numéro de Code postal doit être composé de 4 chiffres.' }
            ]}                >

            
            <Input  prefix={<NumberOutlined className="site-form-item-icon" />} placeholder="Code postal" />
        </Form.Item>

        <Form.Item
            name="cin"
            rules={[
                { required: true, message: "Entrez votre numéro de Carte d'identité!" },
                { pattern: /^\d{8}$/, message: "Le numéro de Carte d'identité doit être composé de 8 chiffres." }
            ]}   

>

            
            <Input  prefix={<IdcardFilled className="site-form-item-icon" />} placeholder="Numero de Carte d'identité" />
        </Form.Item>


            
        <Form.Item

        >

<label for="image_cin_recto" ><span className='text-danger'>*</span> Photo de carte d'identité (Recto)</label>
                  <input 
                  name="image_cin_recto"
                  class="form-control" 
                  id="image_cin_recto"
                  onChange={handleChangeInput}
                  type='file'
                   accept="image/gif, image/jpeg, image/png"
                  required
                  />

<div className="invalid-feedback">Upload Photo de carte d'identité (Recto)!</div>
              
                 </Form.Item>



                 <Form.Item
        
            
        >

            
<label for="image_cin_verso" ><span className='text-danger'>*</span> Photo de carte d'identité (Verso)</label>
                  <input 
                  name="image_cin_verso"
                  class="form-control" 
                  id="image_cin_verso"
                  onChange={handleChangeInput}
                  type='file'
                   accept="image/gif, image/jpeg, image/png"
                  required
                  />             
                   <div className="invalid-feedback">Upload Photo de carte d'identité (Verso)!</div>
                
                
                 </Form.Item>


   



        <Form.Item
        >

<label for="profile_image" ><span className='text-danger'>*</span> Photo de profile</label>

                <input 
                  name="profile_image"
                  class="form-control" 
                  id="profile_image"
                  onChange={handleChangeInput}
                  type='file'
                   accept="image/gif, image/jpeg, image/png"
                  required
                  />
                <div className="invalid-feedback">Upload Photo de profile!</div>
                
                 </Form.Item>
         

    








{
// ------------------------------------------
}

        <Form.Item
                            name="role"
                            rules={[{ required: accountType == "Choix type de compte" ? true :false, message: 'Entrez le type de compte!' }]}
                        >
            <Dropdown style={{width:'100%'}}  menu={ menuProps } >
                <Button style={{width:'100%'}} >
                    <Space>
                        {accountType}
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </Form.Item>
        <>


        {(() => {
if (accountType=="Client") {
  return (
               // ------------------------------------------CLIENT FORMULAURE------------------------------------------

  <>
    
    <Form.Item
name="password"
rules={[
{ 
required: true, 
message: "Entrez votre Mot de passe!" 
},
{
min: 8,
message: 'Le mot de passe doit contenir au moins 8 caractères.'
},
{
pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, et un symbole.'
}
]}
>
<Input.Password
autoComplete="new-password"

placeholder="Mot de passe"
iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
/>
</Form.Item>

<Form.Item

dependencies={['password']}
name="comfirme_mot_de_passe"
rules={[
{ 
required: true, 

message: "Confirmer votre Mot de passe!"
},
({ getFieldValue }) => ({
validator(_, value) {
if (!value || getFieldValue('password') === value) {
  return Promise.resolve();
}
return Promise.reject(new Error('Les mots de passe saisis ne correspondent pas!'));
},
}),
]}
>
<Input.Password
  autoComplete="new-password"
  
  placeholder="Confirmer mot de passe"
  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
/>   
</Form.Item>
</>




  )
} 

    // ------------------------------------------TRANSPORTEUR FORMULAURE------------------------------------------


else if (accountType=="Transporteur") {
  return (
    <>


<Form.Item
      
      >

        
<p className='text-danger' style={{marginBottom:'15px'}}>* IBAN: 558458845955542</p> 
<label for="reçus_paiement" ><span className='text-danger'>*</span> Upload Reçus de paiement</label>
                <input 
                name="reçus_paiement"
                class="form-control" 
                id="reçus_paiement"
                onChange={handleChangeInput}
                type='file'
                 accept="image/gif, image/jpeg, image/png"
                required
                />
                 <div className="invalid-feedback">Upload Reçus de paiement!</div>

              
               </Form.Item>

<Form.Item
      
      >

        
<label for="image_permi_recto" ><span className='text-danger'>*</span> Upload Photo de Permis (Recto)</label>
                <input 
                name="image_permi_recto"
                class="form-control" 
                id="image_permi_recto"
                onChange={handleChangeInput}
                type='file'
                 accept="image/gif, image/jpeg, image/png"
                required
                />
                 <div className="invalid-feedback">Upload Photo de Permis (Recto)!</div>

              
               </Form.Item>



               <Form.Item
       
      >

        
<label for="image_permi_verso" ><span className='text-danger'>*</span> Photo de Permis (Verso)</label>
                <input 
                name="image_permi_verso"
                class="form-control" 
                id="image_permi_verso"
                onChange={handleChangeInput}
                type='file'
                 accept="image/gif, image/jpeg, image/png"
                required
                />
                 <div className="invalid-feedback">Upload Photo de Permis (Verso)!</div>

              
               </Form.Item>




               <Form.Item
        
      >

        
<label for="image_carte_grise_recto" ><span className='text-danger'>*</span> Photo de Carte grise (Recto)</label>
                <input 
                name="image_carte_grise_recto"
                class="form-control" 
                id="image_carte_grise_recto"
                onChange={handleChangeInput}
                type='file'
                 accept="image/gif, image/jpeg, image/png"
                required
                />
                 <div className="invalid-feedback">Upload Photo de Carte grise (Recto)!</div>

              
               </Form.Item>

               <Form.Item
          
          
     
      >

              
                <label for="image_carte_grise_verso" ><span className='text-danger'>*</span> Photo de Carte grise (Verso)</label>
                <input 
                name="image_carte_grise_verso"
                className="form-control" 
                id="image_carte_grise_verso"
                onChange={handleChangeInput}
                type='file'
                 accept="image/gif, image/jpeg, image/png"
                required
                />
                 <div className="invalid-feedback">Upload Photo de Carte grise (Verso)!</div>


              
               </Form.Item>


<Form.Item
name="marque_vehicule"
rules={[{ required: true, message: "Entrez votre Marque de Véhicule!" }]}
>


<Input  prefix={<TruckFilled className="site-form-item-icon" />} placeholder="Marque de Véhicule" />
</Form.Item>

  <Form.Item
  name="matricule_vehicule"
  rules={[{ required: true, message: "Entrez votre Matricule de Véhicule!" }]}
  >


<Input  prefix={<FieldNumberOutlined  className="site-form-item-icon" />} placeholder="Matricule de Véhicule" />
</Form.Item>
<Form.Item
name="tonnage_vehicule"
rules={[{ required: true, message: "Entrez votre Tonnage de Véhicule (Kg)!" }]}
>


<InputNumber prefix={<GoldFilled className="site-form-item-icon" />} style={{ width: "100%", padding:'10px'}}  min={1} max={5000}  placeholder='Tonnage de Véhicule (Kg)' />


</Form.Item>
</>
  )
}
})()}


        </>
        <Form.Item>
            <Button  type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                Crée compte
            </Button>
            <span> Vous avez un compte<Link to="/login" style={{textDecoration: 'none' }}>, Cliquez ici</Link> </span>

        </Form.Item>



        
    </Form>
    </div>
  );
};

export default FormSignup;
