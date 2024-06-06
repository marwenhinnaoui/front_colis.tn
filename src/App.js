import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NotFound from "./components/404";
import FormSignin from './components/auth/signin/FormSigIn';
import Form from "./components/auth/signup/Form";
import Home from "./components/dashboardClient/pages/Home";
import HomeTransporteur from "./components/dashboardTransporteur/pages/Home";
import Profile from "./components/dashboardClient/pages/Profile";
import ProfileTransporteur from "./components/dashboardTransporteur/pages/Profile";
import EnvoyerColis from "./components/dashboardClient/pages/envoyerColis";
import "./components/styles/main.css";
import "./components/styles/responsive.css";
import Calendrier from "./components/dashboardTransporteur/pages/Calendrier";
import { connect } from "react-redux";
import Homeadmin from "./components/DashboardAdmin/pages/homeadmin";
import Reclamation from "./components/DashboardAdmin/pages/reclamation";
import Profileadmin from "./components/DashboardAdmin/pages/profileadmin";
import Crudadmin from "./components/DashboardAdmin/pages/crudadmin";

const  App =({ userId, userToken ,userRole }) => {
const navigate=useNavigate()
const [Localtoken, setToken] = useState(null);

    useEffect(() => {

        setToken(userToken)
        console.log("Localtoken", Localtoken);
        console.log("userRole", userRole);
        console.log("userId", userId);
        if (userToken) {
          if( userRole=='c'){
            navigate('/dashboardClient');

          }else if (userRole=='t'){
            navigate('/dashboardTransporteur');

          }else if (userRole=='a'){
            navigate('/dashboardAdmin');

          }
        }else{
            navigate('/login');
        }
      
    }, [Localtoken]);
  return (
    <div className="App">
   
          <Routes>
          <Route path="/login" element={<FormSignin />} />
                          <Route path="/notfound" element={<NotFound />} />
                <Route path="/singup" element={<Form />} />

                  <Route exact path="/dashboardClient" element={<Home/>} />
                  <Route exact path="/dashboardAdmin" element={<Homeadmin/>} />
                  <Route exact path="/admin/reclamation" element={<Reclamation/>} />
                  <Route exact path="/dashboardTransporteur" element={<HomeTransporteur/>} />
                  <Route exact path="/client/profile" element={<Profile/>} />
                  <Route exact path="/admin/profile" element={<Profileadmin />} />
                  <Route exact path="/admin/crudadmin" element={<Crudadmin />} />
                  <Route exact path="/transporteur/profile" element={<ProfileTransporteur/>} />
                  <Route exact path="/transporteur/calendrier" element={<Calendrier/>} />
                  <Route exact path="/client/envoyer_colis" element={<EnvoyerColis/>} />

          </Routes>


    </div>
  );
}


const mapStateToProps = state => ({
  userId: state.user ? state.user.id : null,
  userToken: state.user ? state.user.token : null,
  userRole: state.user ? state.user.role : null,
});

export default connect(mapStateToProps)(App);
