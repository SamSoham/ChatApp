import { Box, Stack, Typography,IconButton, Button } from "@mui/material";
import { useEffect,useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import ChatInput from "../components/ChatInput";
import { sendMessageRoute,getAllMessageRoute,server } from "../utils/APIroutes";
import axios from 'axios'
import {io} from 'socket.io-client'
import { v4 as uuidv4 } from "uuid";
export default function Chat(){
    
    const socket = useRef()
    const scrollRef= useRef()
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [messages,setMessages] = useState([])
    const admin_id = "6482d627ffd2ac3da8f7c410"
    const navigate = useNavigate();
    const info = JSON.parse(localStorage.getItem('chat-app-user'))
function logout(){
    localStorage.removeItem('chat-app-user')
    navigate('/login')
}
 function Welcome(){
     setTimeout(()=>{
        handleAdminMsg("Hi there!👋")
     },1000)
     setTimeout(()=>{
        handleAdminMsg("I'm Wysa - an AI chatbot built by therapists.")
     },1000)
    //  handleAdminMsg("I'm Wysa - an AI chatbot built by therapists.")
    //  handleAdminMsg("I'm here to understand your concerns and connect  you with the best resources available to support you")
    //  handleAdminMsg("Can I help?")
}
async function handleSendMsg(msg){
 const response = await axios.post(sendMessageRoute,{
    from: info._id,
    to: admin_id,
    message: msg
  });
  socket.current.emit("send-msg",{
    from: info._id,
    to: admin_id,
    message: msg
  })
  const msgs = [...messages]
  msgs.push({fromself:true,message:msg})
  setMessages(msgs)
}
async function handleAdminMsg(msg){
    const response = await axios.post(sendMessageRoute,{
       from: admin_id,
       to: info._id,
       message: msg
     });
     socket.current.emit("send-msg",{
        from: admin_id,
       to: info._id,
       message: msg
     })
     const msgs = [...messages]
     msgs.push({fromself:false,message:msg})
     setMessages(msgs)
   }

async function getMsg(){
    const response = await axios.post(getAllMessageRoute,{
        from: info._id,
         to: admin_id,
    })
    setMessages(response.data)
}
useEffect(()=>{
    if(!localStorage.getItem("chat-app-user")){
     navigate('/login')
    }
 },[])


useEffect(()=>{
    socket.current =  io(server)
    socket.current.emit("add-user",info._id)
  getMsg()
},[])

 useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromself: false, message: msg });
      });
    //Broadcast message not working
      socket.current.on("broadcast",(msg)=>{
        console.log(msg)
        console.log("Broad")
      })
    }
  }, []);
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    return(
        <>
        <Box sx={{background:'linear-gradient(239.26deg, #DDEEED 63.17%, #FDF1E0 94.92%)',minHeight:"100vh",display:"flex",alignItems:"center",flexDirection:"column"}}>
           <Stack direction="row" justifyContent="space-between" padding="24px" width="80vw">
            <Stack direction="row" gap="16px" alignItems="center">
                <img src={`data:image/svg+xml;base64,${info.avatarImage}`} width={60}  />
                <Typography variant="body1" color="initial">{info.username}</Typography>
            </Stack>
            <IconButton sx={{width:"50px"}} onClick={logout}>
                <LogoutIcon sx={{color:"black"}} />
            </IconButton>
           </Stack>
           <Box sx={{width:{sm:"600px",xs:"320px"}}}>
            <Stack gap="8px" sx={{height:"60vh",overflowY:"scroll",marginBottom:"20px"}}>
             {messages.map((n)=>{
                return(
                    <Box ref={scrollRef} key={uuidv4()} sx={{padding:"6px",display:"flex",alignItems:"center",justifyContent:n.fromself?"flex-end":"flex-start"}} >
                     <Typography variant="body1" color="initial" sx={{padding:"16px",background:"white",borderRadius:"16px",maxWidth:"250px",wordBreak:"break-word"}}>{n.message}</Typography>
                    </Box>
                )
             })}
            </Stack>
            <ChatInput handleSendMsg={handleSendMsg} />
            <Button onClick={Welcome}>Admin</Button>
           </Box>
        </Box>
        </>
    )
}