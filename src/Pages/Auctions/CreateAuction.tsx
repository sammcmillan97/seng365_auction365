import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import {Avatar, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import {getCategories} from "../../Service/AuctionService";

const CreateAuction = () => {

    const theme = createTheme();
    const [formErrors, setFormErrors] = useState("")
    const [imageURL, setImageURL] = useState("")
    const [categories, setCategories] = useState<Array<Category>>([])
    const [time, setTime] = useState("")

    useEffect(() => {
        const getDetails = async () => {

            const categoriesResponse = await getCategories()
            setCategories(categoriesResponse.data)
        }
        getDetails()
    }, [])

    async function handleCreateAuction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const auctionForm = new FormData(e.currentTarget);
        const duration = parseInt(String(auctionForm.get('duration')))
        setTime(getEndDate(duration))
    }

    function imageUploadHandler(e: React.ChangeEvent<HTMLInputElement>) {

    }

    function getEndDate(days: number) {
        const date = new Date()
        date.setDate(date.getDate() + days)
        return date.toISOString().substring(0, date.toISOString().length - 8)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Create Auction
                    </Typography>
                    <Typography component="h1" variant="h5">
                        {time}
                    </Typography>
                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await handleCreateAuction(e)} sx={{mt: 1}}>

                        <TextField margin="normal" required fullWidth label="Title" name="title"  id="title" autoFocus/>
                        <TextField margin="normal" required fullWidth label="Description" name="description" id="description" multiline maxRows={4}> </TextField>
                        <TextField margin="normal" fullWidth label="Duration (days)" name="duration" id="duration" type="number"> </TextField>
                        <TextField margin="normal" fullWidth label="Reserve" name="reserve" id="reserve" type="number"> </TextField>
                        <Select label="Categories" fullWidth name="categories" required id="categories">
                            {categories.length === 0 ? <MenuItem>Server Down</MenuItem> :
                                categories.map((category: Category) => (
                                    <MenuItem key={category.categoryId} value={category.name}>{category.name}</MenuItem>
                                ))}
                        </Select>
                        <Typography component='h3' sx={{marginTop: 2}}>
                            Upload a auction photo
                        </Typography>
                        <Avatar sx={{height: 150, width: 150, marginBottom: 2, marginTop: 2}} alt="Profile Image" src={imageURL} />
                        <input type="file"  accept=".jpeg,.jpg,.gif,.png" onChange={(e) =>  imageUploadHandler(e)} />
                        <Button type="submit" fullWidth variant="contained" sx={{marginTop: 2}}>
                            Create
                        </Button>
                        <div>
                            <Typography sx={{color: 'red'}}> {formErrors} </Typography>
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

export default CreateAuction