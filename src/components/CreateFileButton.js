import { useState } from "react"
import AlertDialog from "./AlertDialog";
import Snackbar from "./Snackbar";
import { useDispatch, useSelector } from "react-redux";
import Button from '@mui/material/Button';
import { setFiles } from "../store/files";
import { useNavigate } from "react-router-dom";

export default function CreateFileButton({id=""}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const files = useSelector( state => state.files.allFiles);
    const [ creatingFile, setCreatingFile ] = useState(false);
    const [newFile, setNewFile] = useState({});
    const [snack, setSnack] = useState();
    
    const createNewFile = async () => {
        if( !newFile.fileName ){
          setSnack({
            active: true,
            message: "File Name Can't be Empty!",
            severity: "error"
          });
          return;
        }
        if( !newFile.description ){
          setSnack({
            active: true,
            message: "Please provide a description!",
            severity: "error"
          });
          return;
        }
        const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers:{
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(newFile)
        })
        const response = await resp.json();
        if( response.status === "success"){
          dispatch( setFiles([...files, response.data.file]));
          setNewFile({});
          navigate(`/track/${response.data.file.fileId}`);
        }
        setCreatingFile(false);
      }
    
    return (
        <div>
            {
                snack?.active &&
                <div style={{position: 'absolute'}}>
                <Snackbar open={snack.active} setOpen={setSnack} message={snack.message} severity={ snack.severity}/>
                </div>
            }
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
            <Button onClick={()=>setCreatingFile(true)} variant="contained" id={id}>Create New File</Button>
        </div>
    )
}
