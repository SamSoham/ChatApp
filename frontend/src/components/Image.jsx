import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
 
function Image() {
    const [file, setFile] = useState("upload.png");
    const [show, setShow] = useState(true);
    function handleChange(e) {
        console.log(e.target.files);
        setShow(false)
        setFile(URL.createObjectURL(e.target.files[0]));
    }
 
    return (
     <div className="image">
           <Box sx={{padding:"20px",display:"flex",flexDirection:"column",alignItems:"center",gap:"16px"}}>
           <Typography variant="h6" color="initial" sx={{fontWeight:"700"}}>Profile Pic</Typography>
            <img src={file} width={150} height={150} style={{borderRadius:"50%"}}/>
            <Box sx={{display:show?"block":"none"}}>
            <input type="file" onChange={handleChange} />   
            </Box>
        </Box>
     </div>
    );
}
 
export default Image;