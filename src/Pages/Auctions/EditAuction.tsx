import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import TextField from "@mui/material/TextField";
import {InputLabel, MenuItem, Select} from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import {SyntheticEvent, useEffect, useState} from "react";
import defaultImage from "../../Resources/Images/default image.png";
import Button from "@mui/material/Button";
import {useNavigate, useParams} from "react-router-dom";
import {
    createAuction,
    editAuction,
    getCategories,
    getIndividualAuction,
    uploadAuctionImage
} from "../../Service/AuctionService";
import {checkLoggedIn, getUser} from "../../Service/UserService";
import {Description} from "@mui/icons-material";

const EditAuction = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const theme = createTheme();
    const [debug, setDebug] = useState("")
    const [formErrors, setFormErrors] = useState("")
    const [imageURL, setImageURL] = useState('http://localhost:4941/api/v1/auctions/' + id + '/image')
    const [categories, setCategories] = useState<Array<Category>>([])
    const [durationError, setDurationError] = useState(true)
    const [reserveError, setReserveError] = useState(true)
    const [imageData, setImageData] = useState(null)
    const [imageChanged, setImageChange] = useState(false)
    const [selectedAuction, setSelectedAuction] = React.useState<AuctionIndividual>({auctionId: 0, title: "", categoryId: 0, sellerId: 0, sellerFirstName: "",
        sellerLastName: "", reserve: 0, numBids: 0, highestBid: 0, endDate: "", description: ""})

    React.useEffect(() => {
        const load = async () => {
            await getDetails();
        }
        load()
    }, [])

    const getDetails = async () => {
        if (!checkLoggedIn()) {
            navigate("/auctions")
        }
        const auctionId = id || ""
        const userId = getUser()
        const auctionResponse = await getIndividualAuction(auctionId)
        setSelectedAuction(auctionResponse.data)
        const categoriesResponse = await getCategories()
        setCategories(categoriesResponse.data)
    }



    async function handleEditAuction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const auctionForm = new FormData(e.currentTarget);
        let title = String(auctionForm.get('title'))
        let description = String(auctionForm.get('description'))
        const duration = parseInt(String(auctionForm.get('duration')))
        let reserve = parseInt(String(auctionForm.get('reserve')))
        let category = parseInt(String(auctionForm.get('categories')))
        let dateString = ""

        if (title === "") {
            title = selectedAuction.title
        }
        if (isNaN(duration)) {
            dateString = selectedAuction.endDate.substring(0, selectedAuction.endDate.length -1)
        } else {
            dateString = getEndDate(duration)
        }
        setFormErrors(dateString)
        if (isNaN(reserve)) {
            reserve = selectedAuction.reserve
        }
        if (description === "")
            description = selectedAuction.description
        if (isNaN(category)) {
            category = selectedAuction.categoryId
        }
        if(!checkNumbers(duration, reserve)) {
            return
        }

        const body = {
            title: title,
            description: description,
            categoryId: category,
            endDate: dateString,
            reserve: reserve
        }
        const editAuctionResponse = await editAuction(body, selectedAuction.auctionId)
        if (editAuctionResponse !== 200) {
            // setFormErrors(dateString)
            return
        }
        if (imageChanged) {
            const imageResponse = await uploadAuctionImage(selectedAuction.auctionId, imageData)
            if(imageResponse !== 200 || imageResponse !== 201) {
                setFormErrors("Something went wrong during image uploading")
            }
        }
        navigate("/auctions/" + selectedAuction.auctionId)
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
            setImageChange(true)
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
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <Box sx={{marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Edit Auction
                    </Typography>
                    <Typography component="h1" variant="h5">
                        {debug}
                        {formErrors}
                    </Typography>
                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await handleEditAuction(e)} sx={{mt: 1}}>
                        <TextField margin="normal" fullWidth label="Title" name="title"  id="title" autoFocus/>
                        <TextField margin="normal" fullWidth label="Description" name="description" id="description" multiline maxRows={6}> </TextField>
                        <TextField helperText={!durationError ? "Must greater then zero": ""} margin="normal" fullWidth label="Duration (days)" name="duration" id="duration" type="number"> </TextField>
                        <TextField sx={{pb:2}} helperText={!reserveError ? "Must greater then zero": ""}  margin="normal" fullWidth label="Reserve" name="reserve" id="reserve" type="number"> </TextField>
                        <InputLabel >Category*</InputLabel>
                        <Select label="Category" fullWidth name="categories" id="categories">
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

export default EditAuction