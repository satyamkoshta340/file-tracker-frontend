import { ReactComponent as FilesSVG} from "../media/files.svg"
import { useEffect, useState } from "react"
import AlertDialog from "../components/AlertDialog";
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [ creatingFile, setCreatingFile ] = useState(false);
  const [newFile, setNewFile] = useState({});

  const navigate = useNavigate();
  const { user } = useSelector ( state => ({
    user: state.userStore.user
  }))
  useEffect(()=>{
    if( !user.gID ){
      navigate("/file-tracker-frontend");
    }
    else{
      const loadUsersFiles = async () =>{
        const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'content-type': 'application/json'
          }
        });
        const response = await resp.json();

        if( response?.data?.files.length) setFiles(response.data.files);
      }
      loadUsersFiles();
    }
  }, [])

  const createNewFile = async () => {

    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify(newFile)
    })
    const response = await resp.json();

    setFiles([...files, newFile]);
    setNewFile({});
    setCreatingFile(false);
  }
  return (
    <div className="flex-box page-box">
      {
      creatingFile &&
        <AlertDialog
          name={"Register new File"} 
          content={
          <div className="file-form">
            <div className="file-form-row-block">
              <div>File Name</div>
              <input type={'text'} className="file-input" onChange={(e)=>setNewFile( { ...newFile, fileName: e.target.value} )} defaultValue={newFile.fileName} />
            </div>
            <div className="file-form-row-block">
              <div>Description</div>
              <input type={'text'} className="file-input" onChange={(e)=>setNewFile( { ...newFile, description: e.target.value} )} defaultValue={newFile.description} />
            </div>
            <Button variant="contained" onClick={()=> createNewFile()}>
              Register
            </Button>
          </div>} 
          title={"Register New File"}
          open={creatingFile}
          actionName = {"Cancel"}
          setOpen = { setCreatingFile }
        />
    }
    {
      files.length === 0 &&
      <>
        <FilesSVG  className="home-background" style={{top: 80, position: 'absolute', zIndex: -1}}/>
        <div className="flex-col-box" style={{paddingTop: '12rem'}}>
          <h3>You haven't Registered any file yet!</h3>
          <Button onClick={()=>setCreatingFile(true)} variant="contained">Register New</Button>
        </div>
      </>
    }
    {
      files.length !== 0 &&
      <div className="flex-col-box" >
        <div>
        <Button onClick={()=>setCreatingFile(true)} variant="contained">Register New</Button>
          </div>
        
        <div className="files-box">
        {
          files.map(file=>{
            return <div className="file-container flex-col-box" key={file.fileId}>
              <div>
                <b>Name</b> <br/>
                {file.fileName}
              </div>
              <div>
              <b>Description</b> <br/>
                {file.description}
              </div>
            </div>
          })
        }
      </div>
      </div>
    }
    </div>
  )
}
