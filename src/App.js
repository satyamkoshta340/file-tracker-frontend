import './styles';
import axios from "axios";
import About from './pages/About';
import Home from './pages/Home';
import Files from './pages/Files';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFoundPage from './pages/NotFoundPage';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  const dispatch = useDispatch()
  const getUser = async()=>{
    try{
      
      const data  = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/google/success`, { withCredentials: true});
      const user = data?.data?.data?.user;
      if( user ){
        dispatch({ type: "user/SET_USER", payload:  {user}});
      }

    }
    catch(err){
      
    }
  }
  useEffect(()=>{
    getUser();
  }, []);

  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/file-tracker-frontend" element={ <Home/> } id="home"/>
          <Route path="/file-tracker-frontend/files" element={ <Files/> }/>
          <Route path="/file-tracker-frontend/about" element={ <About/> }/>
          <Route path='*' element={<NotFoundPage/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
  );
}

export default App;
