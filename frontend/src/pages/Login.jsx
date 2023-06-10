import { Box, Stack, Typography, TextField,InputAdornment,FormControl,OutlinedInput,InputLabel,IconButton,
    Snackbar,Alert, Button} from '@mui/material'
    import Visibility from '@mui/icons-material/Visibility';
    import VisibilityOff from '@mui/icons-material/VisibilityOff';
    import { useEffect, useState } from 'react';
    import { Link,useNavigate } from "react-router-dom";
    import axios from 'axios'
    import { loginRoute } from '../utils/APIroutes';
    
    
    export default function Login(){
        const navigate = useNavigate()
        const [showPassword, setShowPassword] = useState(false);
        const [open,setOpen] = useState(false)
        const [opens,setOpens] = useState(false)
        const [msg,setMsg] = useState("")
        const [values,setValues] = useState({
            username:"",
            pwd:"",
        })
    
        const handleClickShowPassword = () => setShowPassword((show) => !show);
        const handleMouseDownPassword = (event) => {
          event.preventDefault();
        }; 
    
        function handleChange(event){
              setValues({...values,[event.target.name]:event.target.value})
        }
        function handleClose3(event, reason){
            setOpen(false);
          }
        function handleValidation(){
            const {username,pwd} = values
          
             if(username===""){
                setMsg("Username Required");
                setOpen(true);
                return false;
            }
            else if(username.length<8){
                setMsg("Username should be of 8 character");
                setOpen(true);
                return false;
            }
           else if(pwd===""){
                setMsg("Password Required");
                setOpen(true);
                return false;
            }
           else if(pwd.length<8){
                setMsg("Password length must be atleast 8");
                setOpen(true);
                return false;
            }
            return true;
        }
    
        function handleSubmit(event){
            event.preventDefault();
           if(handleValidation()){
            const {username,pwd} = values
            axios.post(loginRoute,{
                username,pwd
            }).then((res)=>{
                if(res.data.status===false){
                    setMsg(res.data.msg);
                    setOpen(true);
                }
                if(res.data.status===true){
                    setMsg(res.data.msg);
                    setOpens(true);
                    localStorage.setItem("chat-app-user",JSON.stringify(res.data.user));
                    navigate('/')
                }
            })
           }
        }
    
        useEffect(()=>{
           if(localStorage.getItem("chat-app-user")){
            navigate('/')
           }
        },[])
    
        return(
            <>
        <Box sx={{
            background:"linear-gradient(239.26deg, #DDEEED 63.17%, #FDF1E0 94.92%)",
            minHeight:"100vh",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
        }}>
           <Stack sx={{
          alignItems:"center",
          gap:"16px",
          background:"#ffffff",
          padding:"24px",
          borderRadius:"8px",
          boxShadow:"0 3px 10px 0 #aaa"
           }}>
            <Typography variant="h4" color="initial">Login</Typography>
            <TextField id="outlined-basic" label="Username" variant="outlined" name='username' onChange={(e)=>handleChange(e)} sx={{width:400}} />
             <FormControl sx={{ width:400 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                name='pwd'
                onChange={(e)=>handleChange(e)}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <Button variant="contained" color="primary" onClick={(e)=>handleSubmit(e)} sx={{width:400}} >
              LOGIN
            </Button>
            <Typography>
                New User? <Link to="/register" >Create an Account</Link>
            </Typography>
           </Stack>
        </Box>
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
          <Snackbar
            open={opens}
            autoHideDuration={4000}
            onClose={handleClose3}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleClose3} severity="success" sx={{ width: "100%" }}>
              {msg}
            </Alert>
          </Snackbar>
            </>
        )
    }