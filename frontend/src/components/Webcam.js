import { useEffect, useRef, useState } from 'react';

const Webcam = () => {

    const [devices, setDevices] =useState([]);
    const [stream, setStream] = useState("");
    const videoRef = useRef(null);

    const getVideo = async () => {
        const _stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { width: 720, height: 1080 }
        })
        setStream(_stream);
        // console.log(stream)
        // navigator.mediaDevices
            // .getUserMedia({
            //     audio: false,
            //     video: { width: 720, height: 1080 }
            // })
        //     .then( stream => {
                // console.log(stream)
                // let video = videoRef.current;
                // video.srcObject = stream;
                // video.play();
                // video.setAttribute("playsinline", "true");
                // video.srcObject = stream;
                // video.onloadedmetadata = ()=>{
                    //get position of video tag;
                    // let {clientLeft, clientTop, videoWidth, videoHeight} = video
                    // handleVideoDem({w:videoWidth, h:videoHeight})
                    //align canvas position with video position
                    // canvas.style.position="absolute";
                    // canvas.style.left=clientLeft.toString();
                    // canvas.style.top=clientTop.toString();
                    // canvas.setAttribute('width', videoWidth.toString());
                    // canvas.setAttribute('height', videoHeight.toString());
                    // video.play();
                // }
            // })
            // .catch( err => {
            //     console.error(err);
            // })
    }
    useEffect( ()=> {
        getVideo();
    }, [videoRef]);

    useEffect(() => {
        (async () => {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(i => i.kind == 'videoinput');
          setDevices(devices);
        })();
      });

  return (
    <div>
        <div>
            <video id='video' ref={videoRef}></video>
            <div>{stream.id}</div>
        </div>

    </div>
  );
};

export default Webcam;
