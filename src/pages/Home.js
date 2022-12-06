import {useState, useRef} from 'react';
import { useSelector } from "react-redux";
import { Camera } from 'react-camera-pro';
import background from '../media/background1.png';
import AlertDialog from '../components/AlertDialog';
import { Button } from '@mui/material';
import Snackbar from "../components/Snackbar";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const { user } = useSelector ( state => ({
    user: state.userStore.user
  }))
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showQrResult, setShowQrResult] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [snack, setSnack] = useState();
  const camera = useRef(null);
  

  const [tick, setTick] = useState();
  const qrcode = window.qrcode;
  const [result, setResult] = useState("")

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
  const updateFileHistory = async (fileId)=>{
    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file/history/${fileId}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers:{
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        info: ""
      })
    });
    const response = await resp.json();
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
          name={"Scan Result"} 
          content={
            <div style={{width:"100%"}}>
              { `File "${result.fileName}", wanna view file or update new file spot.` }
              <div className='flex-box' style={{width:"100%", justifyContent: "space-between", paddingTop: '1rem'}}>
                <Button variant="contained" onClick={(e) => navigate(`/file-tracker-frontend/track/${result.fileId}`) }>View</Button>
                <Button variant="contained" onClick={(e) => updateFileHistory(result.fileId)}>Update</Button>
              </div>
            </div>
          } 
          title={"QR Scan Result"}
          open={showQrResult}
          setOpen = { setShowQrResult }
          actionName = {"Cancel"}
        />
      }
      <img src={background} className='home-background' alt='background' />
      {
        scanning && 
        <div >
          <Camera ref={camera}
          facingMode='environment'
          aspectRatio= {4 / 3}
          numberOfCamerasCallback={i => setNumberOfCameras(i)}
          />
          <button className='btn scan-btn' onClick={(e)=>endScanning()}>❌</button>
        </div>
      }
      {
        !scanning &&
        <div className='flex-col-box'>
          <AlertDialog 
            name={"Start Scan"} 
            content={"Please Login First!"} 
            title={"Login"}
            open={open}
            setOpen = { setOpen }
            actionName = {"Okay"}
          />
          <button onClick={ (e) => startScanning() } className="btn scan-btn">
            Scan
          </button>
        </div>
      }
    </div>
    
  )
}
