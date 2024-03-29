import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {SyntheticEvent, useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import {Avatar, InputLabel, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import {Link, useNavigate} from "react-router-dom";
import {createAuction, getCategories, uploadAuctionImage} from "../../Service/AuctionService";
import {checkLoggedIn} from "../../Service/UserService";
import CardMedia from "@mui/material/CardMedia";
import defaultImage from "../../Resources/Images/default image.png";
import Card from "@mui/material/Card";

const CreateAuction = () => {

    const navigate = useNavigate();
    const theme = createTheme();
    const [formErrors, setFormErrors] = useState("")
    const [imageURL, setImageURL] = useState(defaultImage)
    const [categories, setCategories] = useState<Array<Category>>([])
    const [durationError, setDurationError] = useState(true)
    const [reserveError, setReserveError] = useState(true)
    const [imageData, setImageData] = useState(null)

    useEffect(() => {
        const getDetails = async () => {
            if (!checkLoggedIn()) {
                navigate("/auctions")
            }
            const categoriesResponse = await getCategories()
            setCategories(categoriesResponse.data)
        }
        getDetails()
    }, [])

    async function handleCreateAuction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const auctionForm = new FormData(e.currentTarget);
        const title = String(auctionForm.get('title'))
        const description = String(auctionForm.get('description'))
        const duration = parseInt(String(auctionForm.get('duration')))
        let reserve = parseInt(String(auctionForm.get('reserve')))
        const category = parseInt(String(auctionForm.get('categories')))
        const dateString = getEndDate(duration)
        if(isNaN(reserve)) {
            reserve = 1
        }
        const body = {
            title: title,
            description: description,
            categoryId: category,
            endDate: dateString,
            reserve: 1
        }
        if(!checkNumbers(duration, reserve)) {
            return
        }
        const response = await createAuction(body)
        if ( response.status !== 201 ) {
            setFormErrors(response)
        }
        const auctionId  = response.data.auctionId
        setFormErrors(auctionId)

        const imageResponse = await uploadAuctionImage(auctionId, imageData)
        if (imageResponse !== 201) {
            setFormErrors("something went wrong during image upload, Auction Created")
            return
        }
        navigate("/auctions/myauctions")
    }

    function checkNumbers(duration: number, reserve: number) {
        let durationState = true
        let reserveState = true

        if(duration < 0) {
            setDurationError(false)
            durationState = false
        } else {
            setDurationError(true)
            durationState = true
        }

        if(reserve < 0) {
            setReserveError(false)
            reserveState = false
        } else {
            setReserveError(true)
            reserveState = true
        }
        return reserveState && durationState
    }


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

    function getEndDate(days: number) {
        const date = new Date()
        date.setDate(date.getDate() + days)
        return date.toISOString().substring(0, date.toISOString().length - 1)
    }


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Create Auction
                    </Typography>
                    <Typography component="h1" variant="h5">
                        {formErrors}
                    </Typography>
                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await handleCreateAuction(e)} sx={{mt: 1}}>

                        <TextField margin="normal" required fullWidth label="Title" name="title"  id="title" autoFocus/>
                        <TextField margin="normal" required fullWidth label="Description" name="description" id="description" multiline maxRows={6}> </TextField>
                        <TextField helperText={!durationError ? "Must greater then zero": ""} margin="normal" required fullWidth label="Duration (days)" name="duration" id="duration" type="number"> </TextField>
                        <TextField sx={{pb:2}} helperText={!reserveError ? "Must greater then zero": ""}  margin="normal" fullWidth label="Reserve" name="reserve" id="reserve" type="number"> </TextField>
                        <InputLabel >Category*</InputLabel>
                        <Select label="Category" fullWidth name="categories" required id="categories">
                            {categories.length === 0 ? <MenuItem>Server Down</MenuItem> :
                                categories.map((category: Category) => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>{category.name}</MenuItem>
                                ))}
                        </Select>
                        <Box sx={{pt:5}}> </Box>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
                            <CardMedia component="img"
                                       height="auto"
                                       image={imageURL}
                                       alt="Auction image"
                                       onError={(event: SyntheticEvent<HTMLImageElement>) => event.currentTarget.src = defaultImage}
                            />
                        </Card>
                        <div>
                            <Button variant="contained" component="label">
                                Upload File
                                <input type="file" hidden accept=".jpeg,.jpg,.gif,.png" onChange={(e) =>  imageUploadHandler(e)}/>
                            </Button>
                        </div>
                        <Button type="submit" fullWidth variant="contained" sx={{marginTop: 2}}>
                            Create
                        </Button>
                        <div>
                            <Typography sx={{color: 'red'}}> {formErrors} </Typography>
                        </div>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default CreateAuction