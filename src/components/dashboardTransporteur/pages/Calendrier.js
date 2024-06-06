import Main from '../layout/Main';
import { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, TimePicker, Select, FloatButton, Modal, message, Spin, InputNumber } from 'antd';
import { UserOutlined, NumberOutlined, DownOutlined, InfoCircleFilled, GoldFilled,PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import CalendarComponent from '../components/calendarComponent';
import config from '../../config';
import { connect } from 'react-redux';
import getUserData from '../../api/getUserdata';
import updateUser from '../../api/updateuserdata';
import updateUserField from '../../api/updateuserdata';

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
  const suffix = (
    <>
     
      <DownOutlined />
    </>
  );
const Calendrier=  ({userId, userToken})=>{
    const [jour_depart, setDate] = useState('');
    const [heure_depart, setheure_depart] = useState('');
    const [form] = Form.useForm();
    const [value, setValue] = useState('');
    const [isModalOpen, setIsModalOpen] =useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await getUserData(userId, userToken);
          setData(result);
        } catch (error) {
          console.error('Erreur:', error);
        }
      };
      
      fetchData();
    }, [data]);

    const showModal = () => {
      setIsModalOpen(true);
    };
    
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const updateUserData = async (data) => {
      try{
        const result = await updateUser(userId, data, userToken);
        console.log(result);
      }catch(e){
        console.log('Erreur Update ---------------------------', e);
    
      } 
            };


    const regionOptions = region.map(regionName => ({ value: regionName, label: regionName }));
   

    const onFinish =  async (values)  => {
        const { destenaire_GouvernoratList, _destenaire_zipcode, _poids_disponible_jour} = values
        let destenaire_Gouvernorat = destenaire_GouvernoratList[0]
        let destenaire_zipcode = Number(_destenaire_zipcode)
        let poids_disponible_jour =  Number(_poids_disponible_jour)
        let poids_total_colis_jour = 0
        let transporteur_id=userId
        try {
          const response = await axios({
            headers: {
              'Content-Type': 'application/json',
            },
            url: config.baseUrl+'/create-transporteur-calendrier',
            data:{destenaire_Gouvernorat, heure_depart, jour_depart,poids_total_colis_jour,poids_disponible_jour, destenaire_zipcode, transporteur_id },
            method: 'POST'
          });
          console.log('response: ' +response);
          let is_calendrier_valid = true
          let data={"is_calendrier_valid": is_calendrier_valid}
          updateUserData(data)
          message.success('Journée de travail crée!');
          
        } 
        catch (error) {
          console.log(error);
          message.error('Une erreur inattendue s\'est produite.');
      
         
      
        } finally {

          handleCancel()
        }

 
    }

      const onChangeDate = (date, dateString) => {
        setDate(dateString.toString());
        console.log(dateString.toString());
      };
      const onChangeheure_depart = (value, heure) => {
        setheure_depart(heure);
      };





    return(
        <Main>
{data ? (
                <>
 <FloatButton
      shape="square"
      type="primary"
      style={{ right: 24 }}
      icon={<PlusOutlined />}
      onClick={showModal}
    />

    <Modal title="Crée calendrier" open={isModalOpen} 
    footer={[]}
      onCancel={handleCancel}
    
    >

<Form
                    
                    form={form}
                        style={{margin:'auto',width:'100%', paddingTop:'30px'}}
        
        
        
                        onFinish={onFinish}
            
          >
            <Form.Item
            name="jour_depart"
            rules={[{ required: true, message: "Entrez le Jour de depart!" }]}
            
            >
                <DatePicker  
                
                style={{width:'100%', padding:'5px'}}
        
        
                placeholder='Jour de depart' 
                onChange={onChangeDate}
                 />
        
                    
            </Form.Item>
        
        
                
        
            <Form.Item
                    name="heure_depart"
                    rules={[
                        { required: true, message: 'Entrez Heure de depart!' },
                    ]}
                >
        
                    
                    <TimePicker placeholder='Heure de départ' style={{width:'100%'}}  onChange={onChangeheure_depart}/>
        
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
name="_poids_disponible_jour"
rules={[{ required: true, message: "Entrez votre Poids disponible par jour (Kg)!" }]}
>


<InputNumber  style={{ width: "100%"}}  min={1} max={data.tonnage_vehicule}  placeholder='Poids disponible par jour (Kg)' />


</Form.Item>

            <Form.Item
                    name="_destenaire_zipcode"
                    rules={[
                        { required: true, message: 'Entrez votre Code postal!' },
                        { pattern: /^\d{4}$/, message: 'Le numéro de Code postal doit être composé de 4 chiffres.' }
                    ]}                >
        
                    
                    <Input
                    size='small'

                    placeholder="Code postal" />
                </Form.Item>
        
            <div style={{ marginLeft:'auto' , fontSize:'18px' , display:'flex', width:'100%', justifyContent:'end'}}>
                            <GoldFilled />
                              <span style={{marginLeft:'5px', }}>Tonnage de vehicule : </span>
                                <span style={{marginLeft:'5px', fontSize:'18px',  fontWeight:'600'}}>{data.tonnage_vehicule} Kg</span>
        
                              </div>
        
            <Form.Item>
        
        
                
            <Button
                    style={{lineHeight:'0px', height:'35px', marginTop:'10px'}}
                    type="primary" htmlType="submit" >
                        Crée Calendrier
              </Button>
              </Form.Item>
          </Form>

    </Modal>

                    
                      <CalendarComponent data={data}  is_calendrier_valid={data.is_calendrier_valid}  />
                    
                      </>): (

<div style={{width:'100%', display:'flex' , justifyContent:'center'}}>

    <Spin  />
</div>
                      )
                    }

    </Main>
    );

}
const mapStateToProps = state => ({
  userId: state.user.id,
  userToken: state.user.token,
});
export default connect(mapStateToProps) (Calendrier)