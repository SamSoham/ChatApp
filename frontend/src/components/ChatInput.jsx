import { IconButton,Stack,TextField } from "@mui/material"
import { useState } from "react";
import Picker from "emoji-picker-react";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
export default function ChatInput({ handleSendMsg }){

    const [showEmojiPicker,setShowEmojiPicker] = useState(false)
    const [msg,setMsg] = useState("")
    function handleEmojiPicker(){
        setShowEmojiPicker(!showEmojiPicker)
    }
    const handleEmojiClick = (event, emojiObject) => {
        let message = msg;
        message += emojiObject.emoji;
        setMsg(message);
      };
    const sendChat = (event) =>{
        event.preventDefault()
        if(msg.length>0){
            handleSendMsg(msg)
            setMsg("")
        }
    }
  
    return(
        <>
        <Stack direction="row" justifyContent="space-between" sx={{background:"#ffffff",padding:"12px",borderRadius:"40px"}}>
            <IconButton onClick={handleEmojiPicker}>
                <EmojiEmotionsIcon sx={{color:"#FFBF00"}} />
            </IconButton>
            <TextField variant="outlined" fullWidth={true} value={msg} onChange={(e)=>setMsg(e.target.value)}/>
            <IconButton onClick={(e)=>sendChat(e)}>
                <SendIcon sx={{color:"black"}}/>
            </IconButton>
        </Stack>
        {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </>
    )
}