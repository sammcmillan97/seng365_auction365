import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Link, useNavigate, useParams} from "react-router-dom";
import {checkCorrectUser, checkLoggedIn, retrieveUser, retrieveUserImage, update} from "../../Service/UserService";
import {useState} from "react";
import {Avatar} from "@mui/material";
import defaultImage from "../../Resources/Images/default image.png";

const Profile = () => {

    const navigate = useNavigate();
    const [imageURL, setImageURL] = useState("")
    const {id} = useParams();

    const [user, setUser] = React.useState<User>({email: "", firstName: "", lastName: ""})
    React.useEffect(() => {

        const getUser = async () => {
            const userId = id || "";
            if (!checkLoggedIn()) {
                navigate("/auctions")
            }
            if (!checkCorrectUser(userId)) {
                navigate("/auctions")
            }
            const response = await retrieveUser(userId)
            setUser(response.data)
        }
        const getImage = async () => {
            const userId = id || "";
            const response = retrieveUserImage(userId)
            if (response === null) {
                setImageURL(defaultImage)
            }
            setImageURL(response)
        }
        getImage()
        getUser()
        }, [])


    const theme = createTheme();

    function toEditUser() {
        navigate("/users/edit/" + id)
    }

    function toEditUserImage() {
        navigate("/users/edit/image/" + id)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Avatar sx={{height: 200, width: 200, marginTop: 10}} alt="Profile Image" src={imageURL} />
                </Box>
                <Box sx={{marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                    <Paper elevation={3} sx={{padding: 5,}}>
                        <Typography component="h1" variant="h5" sx={{padding: 2}}>
                            Name: {user.firstName} {user.lastName}
                        </Typography>
                        <Typography component="h1" variant="h5" sx={{padding: 2}}>
                            Email: {user.email}
                        </Typography>
                    </Paper>
                    <Button variant="outlined" sx={{padding: 2}} onClick={toEditUser}> Edit  </Button>
                    <Button variant="outlined" sx={{padding: 2}} onClick={toEditUserImage}> Edit Profile Picture</Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}


export default Profile;
