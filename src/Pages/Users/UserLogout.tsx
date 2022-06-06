import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import {Avatar} from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";
import {checkLoggedIn, getUser, logout} from "../../Service/UserService";
import {useNavigate} from "react-router-dom";
import {useState} from "react";


const UserLogout =  () => {

    const [debug, setDebug] = useState("")

    const theme = createTheme();
    const navigate = useNavigate();

    async function handleLogout() {
        if (!checkLoggedIn()) {
            navigate("/auctions")
        }
        await logout()
        navigate("/users/login")
        window.location.reload()
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <Box sx={{marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Paper elevation={3} sx={{padding: 5, alignItems: 'center'}}>
                        <Typography component="h1" variant="h5" sx={{padding: 2}}>
                            Sad to see you go! {debug}
                        </Typography>
                    <Button variant="outlined" sx={{padding: 2}} onClick={handleLogout}> Logout</Button>
                </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default UserLogout