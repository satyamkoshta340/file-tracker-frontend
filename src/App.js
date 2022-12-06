import './styles';
import axios from "axios";
import About from './pages/About';
import Home from './pages/Home';
import Files from './pages/Files';
import FileTrack from './pages/FileTrack';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFoundPage from './pages/NotFoundPage';
import Profile from './pages/Profile';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  const dispatch = useDispatch()
  const getUser = async()=>{
    try{
      
      // const data  = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/google/success`, { withCredentials: true});
      // const user = data?.data?.data?.user;
      const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user`, {
        method: "GET", 
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const response = await resp.json();
      if( response.status === "success" ){
        dispatch({ type: "user/SET_USER", payload:  { user: response.data.user } });
      }

    }
    catch(err){
      console.error(err);
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
          <Route path="/file-tracker-frontend/track/:fileId" element={ <FileTrack/> }/>
          <Route path="/file-tracker-frontend/about" element={ <About/> }/>
          <Route path="/file-tracker-frontend/profile" element={ <Profile /> } />
          <Route path='*' element={<NotFoundPage/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
  );
}

export default App;
