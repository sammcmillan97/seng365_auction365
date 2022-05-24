import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const Login = () => {

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const navigate = useNavigate();

    const tryLogin = () => {
        axios.post('http://localhost:3000/api/users/login' , {"email": email, "password": password})
            .then((response) => {
                navigate('/')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
        }



    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={tryLogin} sx={{ mt: 1 }}>
                        <TextField id={email} margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus/>
                        <TextField id={password} margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="current-password"/>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign In
                        </Button>
                        <div>
                            <Link to={"/users/register"}>Sign Up</Link>
                        </div>
                    </Box>
                    <div>
                        {}
                    </div>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default Login;