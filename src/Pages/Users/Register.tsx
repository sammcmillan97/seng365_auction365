import axios from "axios"
import {Link, useNavigate} from "react-router-dom"
import * as React from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useState} from "react";
import {register} from "../../Service/UserService";

const Register = () => {

    const [registerErrors, setRegisterErrors] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
        const response = await register(firstName, lastName, email, password);

    }


    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>

                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await registerSubmit(e)} sx={{mt: 1}}>
                        <TextField margin="normal" required fullWidth label="First Name" name="firstName" id="firstName" autoFocus/>
                        <TextField margin="normal" required fullWidth label="Last Name" name="lastName" id="lastName" autoFocus/>
                        <TextField margin="normal" required fullWidth label="Email Address" name="email" id="email" autoFocus/>
                        <TextField margin="normal" required fullWidth name="password" label="Password" type={!showPassword? "password" :"text"} id="password" />
                        <div>
                            <input id="checkbox" type="checkbox" checked={showPassword} onChange={togglePassword}/>
                        </div>

                        <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                            Sign In
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