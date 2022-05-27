import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

const Profile = () => {


    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <image />
                <Box sx={{marginTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                    <Paper elevation={3} sx={{padding: 5, }}>
                        <Typography component="h1" variant="h5" sx={{padding: 2}}>
                            Name Samuel McMillan
                        </Typography>
                        <Typography component="h1" variant="h5" sx={{padding: 2}}>
                            Email test@test@gam.com
                        </Typography>
                    </Paper>
                    <Button variant="outlined" sx={{padding: 2}}> Edit </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}


export default Profile;
