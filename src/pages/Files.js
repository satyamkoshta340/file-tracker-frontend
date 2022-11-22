import { ReactComponent as FilesSVG} from "../media/files.svg"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import AlertDialog from "../components/AlertDialog";
import Button from '@mui/material/Button';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [ creatingFile, setCreatingFile ] = useState(false);
  const [newFile, setNewFile] = useState({});
  const createNewFile = async () => {
    const fileId = uuidv4();
    setNewFile({...newFile, fileId: fileId});
    console.log(newFile);
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
            return <div className="file-container flex-col-box">
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
