import {Link, useNavigate} from "react-router-dom";
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import {login} from "../../Service/UserService";



const Login = () => {

    const [loginErrors, setLoginErrors] = useState("");
    const navigate = useNavigate();

    const loginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const loginForm = new FormData(event.currentTarget);
        const email = String(loginForm.get('email'))
        const password = String(loginForm.get('password'))
        const response = await login(email, password);

        if (response === 200) {
            navigate('/register')
        }
        setLoginErrors("Incorrect password or email")
    }


    const theme = createTheme();

    return (
            <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await loginSubmit(e)}
                         sx={{mt: 1}}>
                        <TextField margin="normal" required fullWidth label="Email Address" name="email"
                                   autoComplete="email" id="email" autoFocus/>
                        <TextField margin="normal" required fullWidth name="password" label="Password" type="password"
                                   id="password" autoComplete="current-password"/>
                        <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                            Sign In
                        </Button>
                        <div>
                            <Link to={"/users/register"}>Sign Up</Link>
                        </div>
                    </Box>
                    <div>
                        <Typography sx={{color: 'red'}}> {loginErrors} </Typography>
                    </div>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default Login;