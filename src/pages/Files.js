import { ReactComponent as FilesSVG} from "../media/files.svg"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateFileButton from "../components/CreateFileButton";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AlertDialog from "../components/AlertDialog";
import Button from '@mui/material/Button';

export default function Files() {

  const navigate = useNavigate();
  const user = useSelector ( state => state.user.value );
  const files = useSelector( state => state.files.allFiles );
  const [isDeleting, setIsDeleting] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(()=>{
    if( !user._id ){
      navigate("/");
    }
  }, [])

  const openFile = async (fileId) => {
    navigate(`/track/${fileId}`)
  }

  const deleteFile =async (fileId) => {
    try{
      const resp = await fetch( `${process.env.REACT_APP_SERVER_URL}/api/file/history/${fileId}`, {
          method: "DELETE",
          mode: "cors",
          credentials: 'include',
          headers:{
              'content-type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
      });
      const response = await resp.json();
      if( response.status === "success" ){
          console.log(response);
          setIsDeleting(false);
      }
      else{
          console.log("error in deleting file")
      }
  }
  catch(err){
      console.log(err);
  }
}

  return (
    <div className="flex-box page-box my-files">
    {
      files.length === 0 &&
      <>
        <FilesSVG  className="home-background" style={{top: 80, position: 'absolute', zIndex: -1}}/>
        <div className="flex-col-box" style={{paddingTop: '12rem', paddingBottom: '2rem'}}>
          <h3>You haven't Registered any file yet!</h3>
          <CreateFileButton />
        </div>
      </>
    }
    {
      isDeleting && 
      <AlertDialog 
        name= "Delete File"
        content = {
          <div>
            <div style={{marginBottom: '1rem'}}>Are you sure, wanna Delete file "{file.fileName}" for ever?</div>
            <div className="row space-between">
            <Button variant="contained" onClick={()=>deleteFile(file.fileId)}>Yes</Button>
            <Button variant="contained" onClick={() => setIsDeleting(false)}>No</Button>
            </div>
          </div>
        }
       
        open={isDeleting}
        setOpen={setIsDeleting}
        title={"Delete File"}
      />
    }
    {
      files.length !== 0 &&
      <div className="flex-col-box" >
        <div>
        <CreateFileButton />
          </div>
        
        <div className="files-box">
        {
          files.map(file=>{
            return <div className="file-container flex-col-box" key={file.fileId} style={{position: 'relative'}}>
              <div>
                <b style={{color: "rgb(108, 108, 108)", fontStyle: "italic"}}>Name</b> <br/>
                {file.fileName}
              </div>
              <div>
              <b style={{color: "rgb(108, 108, 108)", fontStyle: "italic"}}>Description</b> <br/>
                {file.description}
              </div>
              <Button variant="contained" onClick={(e)=>openFile(file.fileId)} style={{height: '2rem', position:'absolute', bottom: '0.5rem', boxSizing: 'border-box', width: 'auto', minWidth: 'none'}}>
                View
              </Button>
              <div className="delete-button" onClick={()=>{
                setFile(file);
                setIsDeleting(true)}}>
                <DeleteForeverIcon />
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
