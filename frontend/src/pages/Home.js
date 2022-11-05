import {useState, useRef} from 'react';
import { useSelector } from "react-redux";
import { Camera } from 'react-camera-pro';
import background from '../media/background1.png';

export default function Home() {
  const { user } = useSelector ( state => ({
    user: state.userStore.user
  }))
  const [scanning, setScanning] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const camera = useRef(null);

    let tick;
    const qrcode = window.qrcode;
    const [result, setResult] = useState("")
    qrcode.callback = res => {
        if (typeof(res) === "string") {
          console.log(res);
          setResult(res);
          clearInterval(tick);
          setScanning(false);
        }
    };

    const startScanning = () => {
        // if( !user.gID ){
        //   alert("login first")
        // }
        // else setScanning(true)
        setScanning(true)
        tick = setInterval(()=>{
            const imageSrc = camera.current.takePhoto()
            qrcode.decode(imageSrc);
        }, 1000);
      }

  return (
    <div className='flex-box home-container' >
      <img src={background} className='home-background' alt='background' />
      {
        scanning && 
        <div>
          <Camera ref={camera}
          numberOfCamerasCallback={setNumberOfCameras}
          />
          <button className='btn' onClick={(e)=>camera.current.switchCamera()}>🔁</button>
        </div>
      }
      {
        !scanning &&
        <div className='flex-col-box'>
          <button onClick={ (e) => startScanning() } className="btn scan-btn">
            Scan
          </button>
          <div>{numberOfCameras +"   "+ result}</div>
        </div>
      }
    </div>
    
  )
}
