import {Link, useNavigate} from "react-router-dom"
import * as React from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {checkLoggedIn, login, register, uploadUserImage} from "../../Service/UserService";
import {Avatar} from "@mui/material";

const Register = () => {

    React.useEffect(() => {
        const load = async () => {
            if (!checkLoggedIn()) {
                navigate("/auctions")
            }
        }
        load()
    }, [])

    const [emailState, setEmailState] = useState( {
        emailState: true
    });

    const [passwordState, setPasswordState] = useState({
        passwordState: true
    })


    const [registerErrors, setRegisterErrors] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    //Photo const
    const [imageData, setImageData] = useState(null)
    const [imageURL, setImageURL] = useState("")

    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword((showPassword) => !showPassword);
    };

    const registerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const registerForm = new FormData(event.currentTarget);
        const email = String(registerForm.get('email'))
        const password = String(registerForm.get('password'))
        const firstName = String(registerForm.get('firstName'))
        const lastName = String(registerForm.get('secondName'))

        if (!checkParameters(email, password)) {
            return
        }

        const response = await register(firstName, lastName, email, password)

        if (response !== 201) {
            setRegisterErrors("Email already in use")
            return
        }

        const loginResponse = await login(email, password)
        if (loginResponse !== 200) {
            setRegisterErrors("Failed to login")
            return
        }

        if(imageData !== null && imageData !== undefined) {
            const imageResponse = await uploadUserImage(imageData)
            if(imageResponse.status !== 201) {
                setRegisterErrors(imageResponse.status)
                return
            }
        }

        navigate('/auctions')
    }

    const checkParameters = (email: string, password: string): boolean => {
        let emailValid = true;
        let passwordValid = true;

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            emailValid = false
            setEmailState({emailState: false})
        } else {
            emailValid = true
            setEmailState({emailState: true})
        }

        if (password.length < 6) {
            passwordValid = false;
            setPasswordState({passwordState: false})
        } else {
            passwordValid = true;
            setPasswordState({passwordState: true})
        }
        return (passwordValid && emailValid)
    }


    const theme = createTheme({
    });


    function imageUploadHandler(e: any) {
        const imageData = e.target.files[0]
        setImageData(imageData)
        if(imageData !== undefined && (imageData.type == 'image/png'
            || imageData.type === 'image/jpg'
            || imageData.type === 'image/gif'
            || imageData.type === 'image/jpeg')) {
            const imageURL = URL.createObjectURL(imageData)
            setImageURL(imageURL)
        } else {
            setImageURL("")
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await registerSubmit(e)} sx={{mt: 1}}>
                        <TextField margin="normal" required fullWidth label="First Name" name="firstName"  id="firstName" autoFocus/>
                        <TextField margin="normal" required fullWidth label="Last Name" name="lastName" id="lastName" autoFocus/>
                        <TextField margin="normal" required fullWidth label="Email Address" name="email" id="email"
                                   helperText={!emailState.emailState ? "Must be a valid email address": ""} autoFocus />
                        <TextField margin="normal" required fullWidth name="password" label="Password" type={!showPassword? "password" :"text"}
                                   id="password" helperText={!passwordState.passwordState ? "Passwords must be at least 6 characters": ""}/>
                        <div>
                            <input id="checkbox" type="checkbox" checked={showPassword} onChange={togglePassword}/>
                        </div>
                        <Typography component='h3' sx={{marginTop: 2}}>
                            Upload a profile photo
                        </Typography>
                        <Avatar sx={{height: 150, width: 150, marginBottom: 2, marginTop: 2}} alt="Profile Image" src={imageURL} />
                        <input type="file"  accept=".jpeg,.jpg,.gif,.png" onChange={(e) =>  imageUploadHandler(e)} />
                        <Button type="submit" fullWidth variant="contained" sx={{marginTop: 2}}>
                            Register
                        </Button>
                        <div>
                            <Typography sx={{color: 'red'}}> {registerErrors} </Typography>
                        </div>
                        <div>
                            <Link to={"/users/login"}>Login</Link>
                        </div>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
export default Register