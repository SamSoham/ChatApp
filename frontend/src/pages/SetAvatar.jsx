import { useState,useEffect } from "react"
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {Snackbar,Stack,Typography,Button,Box,Alert} from '@mui/material'
import { setAvatarRoute } from "../utils/APIroutes"
import { Buffer}  from "buffer"


export default function SetAvatar(){
    const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [msg,setMsg] = useState("")
    const [open,setOpen] = useState(false)
    function handleClose3(event, reason){
        setOpen(false);
      }

async function setProfilePicture(){
  if(selectedAvatar===undefined){
    setMsg("Please Select An Avatar")
    setOpen(true)
  }
  else{
    const user = await JSON.parse(localStorage.getItem('chat-app-user'))
    const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
      image: avatars[selectedAvatar],
    });
    if(data.isSet){
      user.isAvatarImageSet = true;
      user.avatarImage = data.image
      localStorage.setItem('chat-app-user',JSON.stringify(user))
      navigate('/chat')
    }
    else{
      setMsg("Error in setting Avatar..Please try again")
      setOpen(true)
    }
  }
}   



  async function fetchImage(){
    const data = [];
    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}`
      );
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    }
    setAvatars(data);
    setIsLoading(false);
  }
 useEffect(() => {
       fetchImage()
      }, []);
     
      useEffect(()=>{
        if(!localStorage.getItem("chat-app-user")){
         navigate('/')
        }
     },[])
    return(
        <>
       
       {isLoading?<><Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}} >
        <img src="loader.gif" alt="" />
       </Box>
       
                         </>:
                          <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"linear-gradient(239.26deg, #DDEEED 63.17%, #FDF1E0 94.92%)",}}>
                         <Stack sx={{alignItems:"center",gap:"15px"}}>
                         <Typography variant="h4" color="initial">Pick Your Avatar</Typography>
                        <Stack direction="row" gap="14px">
                             {avatars.map((avatar,index)=>{
                                 return(
                                     <Box key={index} sx={{width:80,"&:hover":{
                                         scale:"1.2",transition:"0.4s ease-in-out"
                                     }}} >
                                          <img
                                         src={`data:image/svg+xml;base64,${avatar}`}
                                         alt="avatar"
                                         key={avatar}
                                         onClick={() => setSelectedAvatar(index)}
                                       />
                                     </Box>
                                 )
                             })}
                         </Stack>
                         <Button variant="contained" sx={{width:250}} onClick={setProfilePicture} >
                           Set As Avatar
                         </Button>
                        </Stack>
                        </Box>
                        }
   
   <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose3} severity="error" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
        </>
    )
}