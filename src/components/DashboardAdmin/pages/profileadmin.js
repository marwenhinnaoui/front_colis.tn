import Main from '../layout/Main';
import { useState, useEffect } from 'react';
import getUserData from '../../api/getUserdata';
import { Spin, Flex } from 'antd';
import { connect } from 'react-redux';
import config from '../../config';

const ProfileAdmin = ({ userId, userToken ,userRole }) =>{

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
    return(
        <Main>
        <div style={{width:'100%', display:'flex', flexDirection:'column' , justifyContent:'center', alignItems:'center'}}>
            {data ? (
                <>
                    <div style={{marginTop:'30px',width:'180px', height:'180px', borderRadius:'50%', overflow:'hidden'}}>
                    <img

                    src={config.baseUrl+'/media/uploads/admin.jpg'} alt='image' />
                    </div>

                    <div>
                    <div style={{fontSize:'20px',marginBottom:'20px',width:'100',  textAlign:'right'}}></div>
                    
                    <p style={{fontSize:'14.5px'}}><b>Nom et prénom:</b> {data.namelastname}</p>

                    <p style={{fontSize:'14.5px'}}><b>Email:</b> {data.email}</p>

                    </div>
                </>
            ) : (

                <div style={{width:'100%', display:'flex' , justifyContent:'center'}}>

                    <Spin  />
                </div>
           
            )}
        </div>
    </Main>
    );
}
const mapStateToProps = state => ({
  userId: state.user ? state.user.id : null,
  userToken: state.user ? state.user.token : null,
  userRole: state.user ? state.user.role : null,
});
export default connect(mapStateToProps) (ProfileAdmin)