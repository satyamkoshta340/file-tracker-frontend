import { useState, useRef, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Camera } from 'react-camera-pro';
import background from '../media/background1.png';
import AlertDialog from '../components/AlertDialog';
import { Button } from '@mui/material';
import Snackbar from "../components/Snackbar";
import { useNavigate } from "react-router-dom";
import CreateFileButton from '../components/CreateFileButton';
import DropdownList from '../components/DropdownList';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function Home() {
  const user = useSelector ( state => state.user.value );
  const navigate = useNavigate();

  const [inOut, setInOut] = useState('in');
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showQrResult, setShowQrResult] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [snack, setSnack] = useState();
  const camera = useRef(null);
  const [info, setInfo] = useState("");
  const [recentFiles, setRecenetFiles] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingRecentFiles, setIsLoadingRecentFiles] =useState(false);
  

  const [tick, setTick] = useState();
  const qrcode = window.qrcode;
  const [result, setResult] = useState("")

  useEffect(
    ()=>{
      const func = async () =>{
        setIsLoadingRecentFiles(true);
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
        setIsLoadingRecentFiles(false);
      }
      
      const getAllUsers = async () =>{
        const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/getAllUsers`, {
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
          const temp = response.data.map( item => { return { label: item.email, value: {_id:item._id, firstName: item.firstName, lastName: item.lastName} }})
          setAllUsers(temp)
        }
      }
      func();
      getAllUsers();
    }, []
  );

  const openFile = async (fileId) => {
    navigate(`/track/${fileId}`)
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
    setRecipient(user);
    setInfo({ message:`File recieved by ${user.firstName} ${user.lastName}.`, type: "recieve", fileId: fileId});
  }
  const sendOutFile = (fileId) =>{
    if( recipient === null ){
      setSnack({
        active: true,
        message: "Please select the Recipient first.",
        severity: "error"
      });
      return;
    }
    setInfo({ message:`File sent to ${recipient.firstName + " " + recipient.lastName} from ${user.firstName + " " + user.lastName}.`, type: "send", fileId: fileId});
  }

  const updateFileHistory = async (info)=>{
    console.log(info)
    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file/history/${info.fileId}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers:{
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        info: info.message,
        type: info.type,
        recipientId: recipient._id
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
      navigate(`/track/${result.fileId}`);
    }
    else{
      setSnack({
        active: true,
        message: "Failed to update file spot",
        severity: "error"
      });
    }
  }

  useEffect( () => {
    updateFileHistory(info);
  }, [info]);

  const checkResult = async (res) => {
    const pos = res.search("/track/");
    const fileId = res.substring(pos+7);
    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file/${fileId}`, {
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
            <div style={{width:"100%", color:"black", minWidth: '16rem' }}>
              { `${ inOut === 'in' ? 'Taking In ' : 'Sending Out '} File "${result.fileName}"` }
              { inOut === 'out' &&
              <div style={{width: '100%', boxSizing: 'border-box'}}>
                <DropdownList label={"Recipient"} value={recipient} setValue={setRecipient} allValues={allUsers} />
                {/* <TextField id="filled-basic" label="Description" variant="outlined" onChange={(e) => setInfo(e.target.value)} size="small" style={{width: '100%'}}/> */}
              </div>
              }  
              <div className='flex-box' style={{width:"100%", justifyContent: "space-between", paddingTop: '1rem'}}>
                <Button variant="contained" onClick={(e) => navigate(`/track/${result.fileId}`) }>View</Button>
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
              
              {/* <button onClick={ (e) => {
                startScanning()
               } } className="btn scan-btn">
                Start
              </button> */}
            </div>
          }
          {
            user._id &&
            <div>
              <div className='flex-box home-user-view-wrapper'>
                <div className='home-display-block'>
                  <Button variant="outlined" id="home-display-btn" onClick={(e)=> navigate('/files')}> Existing Files </Button>
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
                {
                  isLoadingRecentFiles ?
                  <div>
                    <Box >
                        <Skeleton  animation='wave' width={'100%'} height={400}/>
                    </Box>
                  </div> :
                  recentFiles.length === 0 ? <div style={{ marginTop: '2rem' }}>
                    No recent file to show.
                  </div>
                  :
                
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
                }
              </div>
            </div>
          }

        </div>
      }
    </div>
    
  )
}
