import zIndex from '@mui/material/styles/zIndex';
import { positions } from '@mui/system';
import {useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import Webcam from 'react-webcam';
import background from '../media/background1.png';

const videoConstraints = {
  width: 480,
  height: 420,
  facingMode: "user"
};

export default function Home() {
  const { user } = useSelector ( state => ({
    user: state.userStore.user
  }))
  const [scanning, setScanning] = useState(false);
  let tick;
  const qrcode = window.qrcode;
  qrcode.callback = res => {

    if (typeof(res) === "string") {
      console.log(res);
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
  }
  return (
    <div className='flex-box home-container' >
      <img src={background} className='home-background' />
      {
        scanning && 
        <div>
          <Webcam audio={false}
            height={420}
            screenshotFormat="image/jpeg"
            width={480}
            videoConstraints={videoConstraints}>{({ getScreenshot }) => {
              tick = setInterval(()=>{
                const imageSrc = getScreenshot()
                qrcode.decode(imageSrc);
              }, 1000);
            }}
          </Webcam>
    </div>
      }
      {
        !scanning &&
        <div className='flex-col-box'>
          <button onClick={ (e) => startScanning() } className="btn scan-btn">
            Scan
          </button>
        </div>
      }
    </div>
    
  )
}
