import './styles';
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
import { setUser } from './store/user';
import { setFiles } from './store/files';
import SentFiles from './pages/SentFiles';
import RecievedFiles from './pages/RecievedFiles';

function App() {

  const dispatch = useDispatch()
  const getUser = async()=>{
    try{
      
      // const data  = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/google/success`, { withCredentials: true});
      // const user = data?.data?.data?.user;
      const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/google/success`, {
        method: "GET", 
        mode: "cors",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      })
      const response = await resp.json();
      if( response.status === "success" ){
        console.log("google")
        dispatch(setUser(response.data.user));
      }
      else{
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
          console.log("email")
          dispatch(setUser(response.data.user));
        }
      }

    }
    catch(err){
      console.error(err);
    }
  }
  const loadUsersFiles = async () =>{
    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    const response = await resp.json();

    if( response?.data?.files?.length){
      dispatch(setFiles(response.data.files));
    };
  }
  useEffect(()=>{
    getUser();
    loadUsersFiles();
  }, []);

  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/files" element={ <Files/> }/>
          <Route path="/track/:fileId" element={ <FileTrack/> }/>
          <Route path="/about" element={ <About/> }/>
          <Route path="/profile" element={ <Profile /> } />
          <Route path="/sent-files" element={ <SentFiles />} />
          <Route path="/recieved-files" element={ <RecievedFiles />} />
          <Route path='*' element={<NotFoundPage/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
  );
}

export default App;
