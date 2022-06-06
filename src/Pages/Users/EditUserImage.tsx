import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    retrieveUser,
    retrieveUserImage,
    uploadUserImage,
    deleteUserImage,
    checkLoggedIn, checkCorrectUser
} from "../../Service/UserService";
import {Avatar} from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";


const EditUserImage = () => {

    const navigate = useNavigate();
    const {id} = useParams();
    const theme = createTheme();
    const [imageURL, setImageURL] = useState("")
    const [imageData, setImageData] = useState(null)
    const [serverResponse, setServerResponse] = React.useState("")

    React.useEffect(() => {

        const getImage = async () => {
            const userId = id || "";
            if (!checkLoggedIn()) {
                navigate("/auctions")
            }
            if (!checkCorrectUser(userId)) {
                navigate("/auctions")
            }
            const response = retrieveUserImage(userId)
            setImageURL(response)
        }
        getImage()
    }, [])

    function toProfile() {
        navigate("/users/" + id)
    }


    async function deleteImage() {
        const deleteImageResponse = await deleteUserImage()
        setServerResponse("Image successfully deleted")
        setImageURL("")
    }

    async function imageUploadHandler(e: any) {
        const imageData = e.target.files[0]
        setImageData(imageData)
        if (imageData !== undefined && (imageData.type == 'image/png'
            || imageData.type === 'image/jpg'
            || imageData.type === 'image/gif'
            || imageData.type === 'image/jpeg')) {
            const imageURL = URL.createObjectURL(imageData)
            setImageURL(imageURL)
            const imageResponse = await uploadUserImage(imageData)
            if (imageResponse.status === 200) {
                setServerResponse("Image successfully changed")
            } else if (imageResponse.status === 201) {
                setServerResponse("Image successfully added")
                return
            } else {
                setServerResponse("Image unable to be uploaded")
            }
        } else {
            setImageURL("")
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Paper elevation={3} sx={{padding: 5, alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Edit User Profile Image
                    </Typography>
                    <Avatar sx={{height: 200, width: 200, marginTop: 10, marginBottom: 10}} alt="Profile Image" src={imageURL}/>
                        <div>
                            <Typography> {serverResponse} </Typography>
                        </div>
                        <div>
                        <Button variant="contained" component="label">
                            Upload File
                            <input type="file" hidden accept=".jpeg,.jpg,.gif,.png" onChange={(e) =>  imageUploadHandler(e)}/>
                        </Button>
                        </div>
                            <Button onClick={deleteImage}>
                                Delete image
                            </Button>
                        <div>
                                <Button onClick={toProfile}>
                                    back
                                </Button>
                        </div>
                        </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default (EditUserImage)