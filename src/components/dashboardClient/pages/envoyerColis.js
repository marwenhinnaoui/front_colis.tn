
import { CloseOutlined, DownOutlined, FieldNumberOutlined, GoldFilled, HomeOutlined, InfoCircleFilled, MailOutlined, PhoneOutlined, PlusCircleFilled, PlusCircleOutlined, PlusOutlined, TagFilled, UserOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, List, Modal, Select, Tag, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import React from 'react';
import config from '../../config';
import '../../styles/main.css';
import Main from '../layout/Main';

import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';


const { TextArea } = Input;



const region  =[

  'Bizerte',
  'Tunis',
  'Beja',
  'Jendouba',
  'Ben Arous',
  'Zaghouane',
  'Touzeur',
]

const MAX_COUNT = 1;

const EnvoyerColis = ({ userId, userToken ,userRole })  => {


  const [fileList, setFileList] = React.useState([

  ]);
  const navigate=useNavigate()

const [value, setValue] = React.useState('');
const [isModalOpen, setIsModalOpen] = React.useState(false);
const [articleList, setArticleList] = React.useState([]);
const [poid_total, setPoids_total] = React.useState(0);
const [prix, setprix_colis] = React.useState(0);
const [loading, setLoading] = React.useState(false);
const [description, setDescription] = React.useState('');
const [jour_depart, setDate] = React.useState('');
const [imageArticle, setimageArticle] = React.useState(null);

const [form] = Form.useForm();
const [selectedFiles, setSelectedFiles] = React.useState({
  image1: null,
  image2: null,
  image3: null,
  image4: null
});

const handleChangeInput = (e, inputName) =>{
  setimageArticle(e.target.files[0])
  setSelectedFiles({
    ...selectedFiles,
    [inputName]: e.target.files[0]
});
}

React.useEffect(async () => {
  
  const totalPoids = articleList.reduce((acc, curr) => acc + curr.poid_article, 0);
  setPoids_total(totalPoids);
  console.log('totalPoids', totalPoids);
  

  try {
    const response = await axios.get(`${config.baseUrl}/cree_colis?poids=${totalPoids}`);
    console.log('prix' , response.data.prix_colis);
    let prix_total_response =  response.data.prix_colis;

    setprix_colis(prix_total_response)
    // setIsLoading(false);
  } catch (error) {
    console.error('Erreur data:', error);
    // setIsLoading(false);
  }



}, [articleList]);

console.log('poids_total', poid_total);




function convertDate(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}


const MatriculeString = () => {
  const length = 10; 
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'COLIS';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const onChangeDate = (date, dateString) => {
  setDate(dateString.toString());
  console.log(dateString.toString());
};

const onFinish = async (values)  => {
  console.log(MatriculeString());
  try {
    const { destenaire_nom_pre, destenaire_email, destenaire_tel, destenaire_adresse, destenaire_zipcode, destenaire_GouvernoratList, destenaire_ville } = values;
    let list_article_json = articleList.map(obj => JSON.stringify(obj)).join(', ');
    list_article_json =`[${list_article_json}]`
    let client_id = userId
        var todaysDate = new Date();
        let creation_date = convertDate(todaysDate) 
        console.log(creation_date);
        console.log("sfd");
    let status_colis = "Traitement"
    let matricule = MatriculeString()
    let destenaire_Gouvernorat = destenaire_GouvernoratList[0]
    console.log('destenaire_Gouvernorat[0]', destenaire_Gouvernorat);
    const response = await axios({
      headers: {
        'Content-Type': 'application/json',
      },
      url: 'http://127.0.0.1:8000/api/cree_colis',
      data: { jour_depart, matricule, description, destenaire_nom_pre, destenaire_email, destenaire_tel, destenaire_adresse, destenaire_zipcode, destenaire_ville, list_article_json, prix, status_colis, poid_total  , client_id ,destenaire_Gouvernorat, creation_date  },
      method: 'POST'
    });
    console.log('response: ' +response);
    console.log('description' +description);
    message.success('Colis crée!');
  } 
  catch (error) {
    console.log(error);
    message.error('Une erreur inattendue s\'est produite.');

   

  } finally {
    setLoading(false);
    navigate('/dashboardClient');

  }
};




const deleteArticle = (index) => {
  const updatedArticleList = [...articleList];
  updatedArticleList.splice(index, 1); 
  setArticleList(updatedArticleList);
}

const onFinishArticle = async (values) => {
  const formData = new FormData();
  console.log('values,', values);

  const filenames = Object.values(selectedFiles).filter(file => file !== null).map(file => file.name);
  console.log('filenames:', filenames);

  var newObjectArticle = {
    nom_article: values.nom_article,
    description_article: values.description_article,
    poid_article: values.poid_article,
    imageListArticle: filenames  
  };

  setArticleList(oldList => [...oldList, newObjectArticle]);

  for (const key of Object.keys(selectedFiles)) {
    if (selectedFiles[key]) {
      formData.append(key, selectedFiles[key]);
    }
  }

  console.log('articleList:', articleList);
  console.log('formData:', formData);

  try {
    await axios.post(config.baseUrl + '/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Error uploading images:', error);
  }

  setIsModalOpen(false);
  form.resetFields();
  setFileList([]);
  setSelectedFiles({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });
};





const showModal = () => {
  
  setIsModalOpen(true);
};

const handleCancel = () => {
  setIsModalOpen(false);
};
const suffix = (
  <>
   
    <DownOutlined />
  </>
);
const regionOptions = region.map(regionName => ({ value: regionName, label: regionName }));

  
  return(
    
   
    <Main style={{margin:'auto'}}>

        <Col span={24} >
  <Form
   style={{margin:'auto',width:'35%', paddingTop:'30px'}}
    
    name="nest-messages"
    onFinish={onFinish}
    
  >
    <div>
    <Form.Item
    name="destenaire_nom_pre"
    rules={[{ required: true, message: "Entrez le Nom Prénom de destinataire!" }]}
    
    >
      <Input
      size='small'
prefix={<UserOutlined   className="site-form-item-icon" />}

          placeholder='Nom Prénom de destinataire'

      />
    </Form.Item>
    <Form.Item
      name='destenaire_email'
      rules={[
        {
          type: 'email', required: true, message: "Entrez l'email de destinataire"
        },
      ]}
    >
            <Input
            size='small'
           prefix={<MailOutlined className="site-form-item-icon" />}

          placeholder='Email de destinataire'

              />
    </Form.Item>
   

    <Form.Item
      name='destenaire_tel'
      rules={[
        { required: true, message: 'Entrez votre numéro téléphone de destinataire!' },
        { pattern: /^\d{8}$/, message: 'Le numéro de téléphone doit être composé de 8 chiffres.' }
    ]}
    >
            <Input
            size='small'
             prefix={<PhoneOutlined className="site-form-item-icon" />} 
          placeholder='Numéro téléphone de destinataire'

      />
    </Form.Item>


    <Form.Item
      name='destenaire_adresse'
      rules={[
        {
         required: true, message: "Entrez l'adresse de destinataire!"
        },
      ]}
    >
            <Input
            size='small'
            prefix={<HomeOutlined className="site-form-item-icon" />}
          placeholder='Adresse de destinataire'

      />
    </Form.Item>



    <Form.Item
      name='destenaire_zipcode'
      rules={[
        { required: true, message: 'Entrez votre Code postal!' },
        { pattern: /^\d{4}$/, message: 'Le numéro de Code postal doit être composé de 4 chiffres.' }
    ]}
    >
            <Input
size='small'
prefix={<FieldNumberOutlined  className="site-form-item-icon" />}
          placeholder='Code postal de destinataire'

      />
    </Form.Item>


    <Form.Item
      name='destenaire_GouvernoratList'
      rules={[
        {
         required: true, message: "Entrez Région de destinataire!"
        },
      ]}
    >
   

<Select
      mode="multiple"
      maxCount={MAX_COUNT}
      value={value}
      style={{ width: '100%' }}
      onChange={setValue}
      suffixIcon={suffix}
      placeholder="Région de destinataire"
      options={regionOptions}
    />
    </Form.Item>
    

    <Form.Item
      name='destenaire_ville'
      rules={[
        {
         required: true, message: "Entrez Ville de destinataire!"
        },
      ]}
    >
            <Input
            size='small'
            prefix={<HomeOutlined className="site-form-item-icon"/>}
          placeholder='Ville de destinataire'

      />
    </Form.Item>
    <Form.Item
            name="jour_depart"
            rules={[{ required: true, message: "Entrez le Jour de depart!" }]}
            
            >
                <DatePicker  
                
                style={{width:'100%', padding:'9px'}}
        
        
                placeholder='Jour de depart' 
                onChange={onChangeDate}
                 />
        
                    
            </Form.Item>
    <Form.Item
      name='description'
      rules={[
        {
          required: true, message: "Entrez Description de colis!"
        },
      ]}
      
    >

       <TextArea showCount

                    placeholder="Description de colis"
                    onChange={(e) =>{setDescription(e.target.value)
                    }}
              
          
          />
    </Form.Item>
    <Form.Item
      name='article'
      rules={[
        {
         required: articleList.length == 0 ? true:false , message: "Le colis doit contenir au moins un article!"
        },
      ]}
    >
      <Button
      onClick={showModal}
      type="dashed" block>

        <div>
        <PlusOutlined /> <span>* Ajoutez un Article</span>
      </div>
    
    </Button>




        {/**-----------------------------------------------Ajouter article---------------------------------------------------------------- */}
        <Modal title="Ajoutez un Article" footer={[]} open={isModalOpen} onCancel={handleCancel} destroyOnClose>



      <Col span={24} >
                <Form
                  style={{margin:'auto',width:'100%', paddingTop:'30px'}}
                    onFinish={onFinishArticle}
                    name="article-form"
                    form={form}
                    
                  >
            <Form.Item
                  name='nom_article'
                  rules={[
                    {
                      required: true, message: "Entrez la Nom de l'article!"
                    },
                  ]}
                  
                >

            <Input  size='small'
prefix={<TagFilled  className="site-form-item-icon" />}
            placeholder="Nom de l'article"

            />


                </Form.Item>




            <Form.Item
            
                  name='description_article'
                  rules={[
                    {
                      required: true, message: "Entrez la description de l'article!"
                    },
                  ]}
                  
                >

                      <TextArea showCount 

                                placeholder="Description de l'article"
                          
                      
                      />


                </Form.Item>

              <Form.Item
                name="poid_article"
                rules={[{ required: true, message: "Entrez le poids d'article (Kg)!" },
                ]}


              >


                      <InputNumber size='small' step="0.001" prefix={<GoldFilled className="site-form-item-icon" />} style={{ width: "100%", padding:'10px'}}  min={1} max={5000}  placeholder="Poids d'article (Kg)" />


              </Form.Item>


              <Form.Item
        
        >
  
          
  <label for="image_carte_grise_recto" ><span className='text-danger'>*</span> Image d'article 1</label>
                  <input 
                  name="image1"
                  class="form-control" 
                  id="image_carte_grise_recto"
                  onChange={(e) =>handleChangeInput(e, 'image1')}
                  type='file'
                   accept="image/gif, image/jpeg, image/png"
                  required
                  />
                   <div className="invalid-feedback">Upload Image d'article!</div>
  
                
                 </Form.Item>
              <Form.Item
        
        >
  
          
  <label for="image_carte_grise_recto" ><span className='text-danger'>*</span> Image d'article 2</label>
                  <input 
                  name="image2"
                  class="form-control" 
                  id="image_carte_grise_recto"
                  onChange={(e) =>handleChangeInput(e, 'image2')}
                  type='file'
                   accept="image/gif, image/jpeg, image/png"
                  required
                  />
                   <div className="invalid-feedback">Upload Image d'article!</div>
  
                
                 </Form.Item>
              <Form.Item
        
        >
  
          
  <label for="image_carte_grise_recto" ><span className='text-danger'>*</span> Image d'article 3</label>
                  <input 
                  name="image3"
                  class="form-control" 
                  id="image_carte_grise_recto"
                  onChange={(e) =>handleChangeInput(e, 'image3')}
                  type='file'
                   accept="image/gif, image/jpeg, image/png"
                  required
                  />
                   <div className="invalid-feedback">Upload Image d'article!</div>
  
                
                 </Form.Item>
              <Form.Item
        
        >
  
          
  <label for="image_carte_grise_recto" ><span className='text-danger'>*</span> Image d'article 4</label>
                  <input 
                  name="image4"
                  class="form-control" 
                  id="image_carte_grise_recto"
                  onChange={(e) =>handleChangeInput(e, 'image4')}
                  type='file'
                   accept="image/gif, image/jpeg, image/png"
                  required
                  />
                   <div className="invalid-feedback">Upload Image d'article!</div>
  
                
                 </Form.Item>

                {/* <Form.Item
                  name='description_article'
                  rules={[
                    {
                      required: true, message: "Entrez la description de l'article!"
                    },
                  ]}  
                  
                >
                  <ImgCrop rotationSlider>
                        <Upload
                          maxCount={4}
                          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                          listType="picture-card"
                          fileList={fileList}
                          onChange={onChange}
                          onPreview={onPreview}
                        >
                          {fileList.length < 4 && '+ Upload'}
                        </Upload>
                      </ImgCrop>
                </Form.Item> */}
                    <Form.Item style={{width:'100%', textAlign:'end'}}>

                    <Button style={{marginRight:'5px'}} type='primary'  htmlType="submit" >Confirmer</Button>
                    <Button  onClick={handleCancel} >Annuler</Button>

                    </Form.Item>

                </Form>
        </Col>
      </Modal>
    </Form.Item>



                    {/* Affichage des articles */}  
                    { articleList.length > 0 ? 
                    <>
                    <Form.Item>
                      
                    <Divider orientation="left">List des articles de colis</Divider>
                      <List
                      style={{width:'100%'}}
                        size="small"
              
                        bordered
                        dataSource={articleList}
                        renderItem={(item, index) => <List.Item style={{display:'flex'}}>
                        {item.nom_article}
                        <span>
                          <Tag icon={<GoldFilled/>} color="processing">
                            {item.poid_article} Kg
                          </Tag>
                        </span>
                        <div style={{cursor:'pointer'}} onClick={() => deleteArticle(index)}><CloseOutlined  style={{color:'#ff4d4f'}} /></div> 
                      </List.Item>}
                      />

                    </Form.Item>
                    <div style={{ marginLeft:'auto' , fontSize:'18px' , display:'flex', width:'100%', justifyContent:'end'}}>
                    <InfoCircleFilled />
                      <span style={{marginLeft:'5px'}}>Prix de colis : </span>
                        <span style={{marginLeft:'5px', fontSize:'18px',  fontWeight:'600'}}>{prix} TND</span>

                      </div>
                      </>
                    
                     : <></> }


{/**----------------------------------------------Ajouter article----------------------------------------------------------------- */}



    
   
    <Form.Item
   
    >
      <Button type="primary" htmlType="submit" loading={loading}>
        Envoyez
      </Button>
    </Form.Item>
    </div>
  </Form>
  </Col>
  </Main>
 );
}



const mapStateToProps = state => ({
  userId: state.user ? state.user.id : null,
  userToken: state.user ? state.user.token : null,
  userRole: state.user ? state.user.role : null,
});
export default connect(mapStateToProps)(EnvoyerColis);

