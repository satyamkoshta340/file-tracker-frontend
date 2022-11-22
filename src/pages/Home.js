import {useState, useRef} from 'react';
import { useSelector } from "react-redux";
import { Camera } from 'react-camera-pro';
import background from '../media/background1.png';
import AlertDialog from '../components/AlertDialog';

export default function Home() {
  const { user } = useSelector ( state => ({
    user: state.userStore.user
  }))

  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const camera = useRef(null);

    let tick;
    const qrcode = window.qrcode;
    const [result, setResult] = useState("")

    const startScanning = () => {
      if( !user.gID ){
        setOpen(true);
      }
      else {
        setScanning(true)
        tick = setInterval(()=>{
            const imageSrc = camera.current.takePhoto()
            qrcode.decode(imageSrc);
        }, 1000);
      }
    }

    const endScanning = ()=>{
      clearInterval(tick);
      setScanning(false);
    }

    qrcode.callback = res => {
        if (typeof(res) === "string") {
          console.log(res);
          setResult(res);
          endScanning();
        }
    };


  return (
    <div className='flex-box home-container' >
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
