import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {checkCorrectUser, checkLoggedIn, retrieveUser, retrieveUserImage, update} from "../../Service/UserService";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";


const EditUser = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverResponse, setServerResponse] = React.useState("")
    const [firstNameErrors, setFirstNameErrors] = React.useState({
        firstNameErrors: true
    })
    const [lastNameErrors, setLastNameErrors] = React.useState({
        lastNameErrors: true
    })
    const [emailErrors, setEmailErrors] = React.useState({
        emailErrors: true
    })
    const [newPasswordErrors, setNewPasswordErrors] = React.useState({
        newPasswordErrors: true
    })
    const [oldPasswordErrors, setOldPasswordErrors] = React.useState({
        oldPasswordErrors: true
    })

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
        getUser()
    }, [])

    const editSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const editForm = new FormData(event.currentTarget);
        let firstName = String(editForm.get('firstName'))
        let lastName = String(editForm.get('lastName'))
        let email = String(editForm.get('email'))
        const userId = id || "";
        const oldPassword = String(editForm.get('oldPassword'))
        const newPassword = String(editForm.get('newPassword'))

        if (!checkParameters(firstName, lastName, oldPassword, newPassword)) {
            return
        }
        if(firstName === "") {
            firstName = user.firstName
        }

        if(lastName === "") {
            lastName = user.lastName
        }

        if(email === "" || null) {
            email = user.email
        }

        const response = await update(userId, firstName, lastName, email, oldPassword, newPassword)
        if(response.statusText === "OK") {
            navigate("/users/" + id)
        } else {
            setServerResponse(response.statusText);
            return;
        }
    }

    const checkParameters = (firstName: string, lastName: string, oldPassword: string, newPassword: string): boolean => {
        let firstNameValid = true
        let lastNameValid = true
        let emailValid = true
        let oldPasswordValid = true
        let newPasswordValid = true

        if (firstName.length < 64) {
            firstNameValid = true
            setFirstNameErrors({firstNameErrors: true})
        } else {
            firstNameValid = false
            setFirstNameErrors({firstNameErrors: false})
        }
        if (lastName.length < 64) {
            lastNameValid = true
            setLastNameErrors({lastNameErrors: true})
        } else {
            lastNameValid = false
            setLastNameErrors({lastNameErrors: false})
        }

        if (newPassword.length > 5 || newPassword.length === 0) {
            newPasswordValid = true
            setNewPasswordErrors({newPasswordErrors: true})
        } else {
            newPasswordValid = false
            setNewPasswordErrors({newPasswordErrors: false})
        }
        if(newPassword.length > 0 && oldPassword.length === 0) {
            oldPasswordValid = false
            setOldPasswordErrors({oldPasswordErrors: false})
        } else {
            oldPasswordValid = true
            setOldPasswordErrors({oldPasswordErrors: true})
        }
        return (firstNameValid && lastNameValid && emailValid && oldPasswordValid && newPasswordValid)
    }

    const togglePassword = () => {
        setShowPassword((showPassword) => !showPassword);
    };

    const theme = createTheme();

    function toProfile() {
        navigate("/users/" + id)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Edit User Details
                    </Typography>
                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await editSubmit(e)} sx={{mt: 1}}>
                        <TextField margin="normal" fullWidth label="First Name" name="firstName"
                                   helperText={!firstNameErrors.firstNameErrors ? "First name must be less then 64 characters": ""} id="firstName" autoFocus/>
                        <TextField margin="normal" fullWidth label="Last Name" name="lastName"
                                   helperText={!lastNameErrors.lastNameErrors ? "Last name must be less then 64 characters": ""} id="lastName" autoFocus/>
                        <TextField margin="normal" fullWidth label="Email" name="email" type="email"
                                   helperText={!emailErrors.emailErrors ? "Email must be valid" : ""} id="lastName" autoFocus/>
                        <TextField margin="normal" fullWidth label="Old Password" name="oldPassword"
                                   helperText={!oldPasswordErrors.oldPasswordErrors ? "Must include old password if changing password": ""} id="oldPassword" autoFocus type={!showPassword? "password" :"text"}/>
                        <TextField margin="normal" fullWidth label="New Password" name="newPassword"
                                   helperText={!newPasswordErrors.newPasswordErrors ? "Password must be at least 6 characters": ""}id="newPassword" autoFocus type={!showPassword? "password" :"text"}/>
                        <div>
                            <input id="checkbox" type="checkbox" checked={showPassword} onChange={togglePassword}/>
                        </div>
                        <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                            Submit
                        </Button>
                        <div>
                            <Typography> {serverResponse} </Typography>
                        </div>
                    </Box>
                    <div>
                        <button onClick={toProfile}>
                            back
                        </button>
                    </div>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default EditUser;