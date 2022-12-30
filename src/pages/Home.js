import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Camera } from 'react-camera-pro';
import background from '../media/background1.png';
import AlertDialog from '../components/AlertDialog';
import { Button } from '@mui/material';
import Snackbar from "../components/Snackbar";
import { useNavigate } from "react-router-dom";
import CreateFileButton from '../components/CreateFileButton';
import { setUser } from '../store/user';


export default function Home() {
  const user = useSelector ( state => state.user.value );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inOut, setInOut] = useState('in');
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showQrResult, setShowQrResult] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [snack, setSnack] = useState();
  const camera = useRef(null);
  const [info, setInfo] = useState("");
  const [recentFiles, setRecenetFiles] = useState([]);
  

  const [tick, setTick] = useState();
  const qrcode = window.qrcode;
  const [result, setResult] = useState("")

  useEffect(
    ()=>{
      const func = async () =>{
        const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/recent-files`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers:{
              'content-type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        const response = await resp.json();
        if( response.status === "success"){
          setRecenetFiles(response.data?.recentFiles)
        }
      }
      func();
    }
  );

  const openFile = async (fileId) => {
    navigate(`/file-tracker-frontend/track/${fileId}`)
  }

  const startScanning = () => {
    if( !user._id ){
      setOpen(true);
    }
    else {
      setScanning(true)
      const tick_ = setInterval(()=>{
          const imageSrc = camera?.current?.takePhoto()
          qrcode.decode(imageSrc);
      }, 1000);
      setTick(tick_);
    }
  }

  const endScanning = ()=>{
    clearInterval(tick);
    setScanning(false);
  }
  const takeInFile = (fileId) =>{
    setInfo(`File recieved by ${user.firstName} ${user.lastName}.`)
    updateFileHistory(fileId);
  }
  const sendOutFile = (fileId) =>{
    updateFileHistory(fileId);
  }
  const updateFileHistory = async (fileId)=>{
    console.log(info)
    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file/history/${fileId}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers:{
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        info: info
      })
    });
    const response = await resp.json();
    console.log(resp)
    if( response.status === "success" ){
      setSnack({
        active: true,
        message: "File Spot updated successfully",
        severity: "success"
      });
      navigate(`/file-tracker-frontend/track/${result.fileId}`);
    }
    else{
      setSnack({
        active: true,
        message: "Failed to update file spot",
        severity: "error"
      });
    }
  }
  const checkResult = async (res) => {
    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file/${res}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers:{
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    const response = await resp.json();
    console.log(response);
    if( response.status === "success" ){
      setResult( response.data.file );
      setShowQrResult(true);
    }
    else{
      setSnack({
        active: true,
        message: "QR don't belong to our domain.",
        severity: "error"
      });
    }
  }
  qrcode.callback = res => {
    if (typeof(res) === "string") {
      console.log(res);
      checkResult(res);
      endScanning();
    }
  };


  return (
    <div className='flex-box home-container' >
      {
        snack?.active &&
        <div style={{position: 'absolute'}}>
          <Snackbar open={snack.active} setOpen={setSnack} message={snack.message} severity={ snack.severity}/>
        </div>
      }
      {
        showQrResult &&
        <AlertDialog 
          name={`${ inOut === 'in' ? 'Taking In ' : 'Sending Out '}`} 
          content={
            <div style={{width:"100%", color:"black"}}>
              { `${ inOut === 'in' ? 'Taking In ' : 'Sending Out '} File "${result.fileName}"` }
              { inOut == 'out' &&
              <div>
                Set Reciever description <input type={"text"} onChange= {(e) => setInfo(e.target.value)}></input>
              </div>
              }  
              <div className='flex-box' style={{width:"100%", justifyContent: "space-between", paddingTop: '1rem'}}>
                <Button variant="contained" onClick={(e) => navigate(`/file-tracker-frontend/track/${result.fileId}`) }>View</Button>
                <Button variant="contained" onClick={(e) => {
                  // updateFileHistory(result.fileId)
                  inOut === 'in' ? takeInFile(result.fileId) : sendOutFile(result.fileId);
                }
                }>{ inOut === 'in' ? 'Take In' : 'Send Out'}</Button>
              </div>
            </div>
          } 
          title={`${ inOut === 'in' ? 'Taking In ' : 'Sending Out '}`}
          open={showQrResult}
          setOpen = { setShowQrResult }
          actionName = {"Cancel"}
        />
      }

      {
        scanning && 
        <div >
          <Camera ref={camera}
          facingMode='environment'
          aspectRatio= {4 / 3}
          numberOfCamerasCallback={i => setNumberOfCameras(i)}
          />
          <button className='btn scan-btn-cancel' onClick={(e)=>endScanning()}>❌</button>
        </div>
      }
      <AlertDialog 
        name={"Start Scan"} 
        content={"Please Login First!"} 
        title={"Login"}
        open={open}
        setOpen = { setOpen }
        actionName = {"Okay"}
      />
      {
        !scanning &&
        <div className='home-user-view'>
          {
            !user._id &&
            <div className='flex-col-box'>
              <img src={background} className='home-background' alt='background' />
              
              <button onClick={ (e) => {
                startScanning()
               } } className="btn scan-btn">
                Start
              </button>
            </div>
          }
          {
            user._id &&
            <div>
              <div className='flex-box home-user-view-wrapper'>
                <div className='home-display-block'>
                  <Button variant="outlined" id="home-display-btn" onClick={(e)=> navigate('/file-tracker-frontend/files')}> Existing Files </Button>
                </div>
                <div className='home-display-block'>
                  <CreateFileButton id="home-display-btn"/>
                </div>
                <div className='flex-col-box' style={{ height: '10rem', justifyContent: 'space-between'}}>
                  <div className='home-display-block' >
                    <Button variant="outlined" id="home-display-btn" onClick={(e)=> {
                      setInOut('in');
                      startScanning();
                      }
                    } style={{height:'4rem'}}> IN File </Button>
                  </div>
                  <div className='home-display-block' style={{height:'4rem'}}>
                    <Button variant="outlined" id="home-display-btn" onClick={(e)=> {
                      setInOut('out');
                      startScanning();
                      }
                    } style={{height:'4rem'}}> OUT File </Button>
                  </div>
                </div>
              </div>
              <div style={{padding:'2rem'}}>
                <span className='recent'>Recent Files</span>
                <div className='flex-box recent-files'>
                {
                  recentFiles.map(file=>{
                    return <div className="file-container flex-col-box" key={file._id} onClick={(e)=>openFile(file._id)}>
                      <div>
                        <b style={{color: "rgb(108, 108, 108)", fontStyle: "italic"}}>Name</b> <br/>
                        {file.fileName}
                      </div>
                      <div>
                      <b style={{color: "rgb(108, 108, 108)", fontStyle: "italic"}}>Description</b> <br/>
                        {file.description}
                      </div>
                    </div>
                  })
                }
                </div>
                
              </div>
            </div>
          }

        </div>
      }
    </div>
    
  )
}
