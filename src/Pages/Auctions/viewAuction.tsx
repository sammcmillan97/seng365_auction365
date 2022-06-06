import {SyntheticEvent, useState} from "react";
import * as React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getAllAuctions, getIndividualAuction, getAllBids, deleteAuction, placeBid} from "../../Service/AuctionService";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
    autocompleteClasses,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import defaultImage from "../../Resources/Images/default image.png";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {getUser} from "../../Service/UserService";
import Button from "@mui/material/Button";
import {debug} from "util";


const ViewAuction = () => {

    const {id} = useParams();
    const [selectedAuction, setSelectedAuction] = React.useState<AuctionIndividual>({auctionId: 0, title: "", categoryId: 0, sellerId: 0, sellerFirstName: "",
                                                                            sellerLastName: "", reserve: 0, numBids: 0, highestBid: 0, endDate: "", description: ""})
    const navigate = useNavigate();
    const [relatedAuctions, setRelatedAuctions] = React.useState<Array<Auction>>([])
    const [bids, setBids] = React.useState<Array<Bid>>([])
    const [currentUser, setCurrentUser] = React.useState(0)
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [deleteErrors, setDeleteErrors] = React.useState("")
    const [bidErrors, setBidErrors] = React.useState("")

    React.useEffect(() => {
    const load = async () => {
        await getDetails();
    }
    load()
    }, [])

    const getDetails = async () => {
        const auctionId = id || "";
        const auctionResponse = await getIndividualAuction(auctionId)
        setSelectedAuction(auctionResponse.data)
        setRelatedAuctions([])
        const bidResponse = await getAllBids(auctionId);
        setBids(bidResponse.data)
        const auctionParams = {
            categoryIds: [auctionResponse.data.categoryId],
        }
        const auctionsResponseOne = await getAllAuctions(auctionParams)
        const similarCategory = (auctionsResponseOne.data.auctions.filter((relatedAuctions: Auction) => (
            relatedAuctions.auctionId !== auctionResponse.data.auctionId)))

        const auctionParamsTwo = {
            sellerId: auctionResponse.data.sellerId
        }
        const auctionsResponseTwo = await getAllAuctions(auctionParamsTwo)
        const similarSeller = (auctionsResponseTwo.data.auctions.filter((relatedAuctions: Auction) => (
            relatedAuctions.auctionId !==  auctionResponse.data.auctionId)))

        const relatedAuctionsList: React.SetStateAction<Auction[]> = []
        similarSeller.forEach((auction: Auction) => {
            if(!similarCategory.includes(auction)) {
                relatedAuctionsList.push(auction)
            }
        });

        setRelatedAuctions(relatedAuctionsList)
        const userId = getUser()
        setCurrentUser(userId)

    }

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    }

    const deleteCancelClose = async () => {

        const deleteResponse = await deleteAuction(selectedAuction.auctionId)
        if (deleteResponse.status === 200) {
            setDeleteOpen(false);
            navigate("/auctions/myauctions")
        } else {
            setDeleteErrors("Something went wrong")
        }

    };

    const deleteConfirmClose = () => {
        setDeleteOpen(false);
    };



    const theme = createTheme();

    function handleEdit() {
        navigate("/auctions/edit/" + selectedAuction.auctionId)
    }

    const bidSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const bidForm = new FormData(event.currentTarget);
        const bidAmount = parseInt(String(bidForm.get('bidAmount')))
        if(currentUser === selectedAuction.sellerId) {
            setBidErrors("You can't place a bid on your own auction")
            return
        }
        if(isNaN(bidAmount)) {
            setBidErrors("Please enter your bid")
        }
        if(bidAmount === 0) {
            setBidErrors("Bid must be greater then zero")
            return
        }
        if(bidAmount < selectedAuction.highestBid) {
            setBidErrors("Bid must be higher then current highest bid")
            return
        }
        setBidErrors("")
        const bidResponse = await placeBid(selectedAuction.auctionId, bidAmount)
        if (bidResponse.status !== 201) {
            setBidErrors(bidResponse.statusText)
            return
        }
        setDeleteOpen(false);
        window.location.reload()
    }


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Box sx={{bgcolor: 'background.paper', pt: 8, pb: 6}}>
                    <Container maxWidth="sm">
                        <Card sx={{height: '100%'}}>
                            {currentUser === selectedAuction.sellerId && selectedAuction.numBids !== 0 ?
                            <Typography>
                                A bid has been made! You may longer edit/delete this auction.
                            </Typography> : ""}
                            {currentUser === selectedAuction.sellerId && selectedAuction.numBids === 0 ?
                            <Stack direction="row" spacing={2} justifyContent="left" >
                                <Button variant="outlined" onClick={handleEdit}>Edit</Button>
                                <Button variant="outlined" onClick={handleDeleteOpen}>
                                    Delete Auction
                                </Button>
                                <div>
                                    <Dialog
                                        open={deleteOpen}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">
                                            {"Delete Auction"}
                                        </DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Are you sure ? Deleting this auction will permanently remove it!
                                            </DialogContentText>
                                            <DialogContentText>
                                                {deleteErrors}
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={deleteConfirmClose}>Cancel</Button>
                                            <Button onClick={deleteCancelClose} autoFocus>
                                                Delete
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            </Stack> : "" }
                            <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom sx={{pt: 3}}>
                                {selectedAuction.title}
                            </Typography>
                            <CardMedia component="img"
                                       sx={{pl:2, pr:2}}
                                       height="auto"
                                       width="auto"
                                       image={'http://localhost:4941/api/v1/auctions/' + id + '/image'}
                                       alt="Auction image"
                                       onError={(event: SyntheticEvent<HTMLImageElement>) => event.currentTarget.src = defaultImage}
                            />
                            <Stack sx={{ pt: 5, pl: 3 }} direction="row" spacing={2} justifyContent="left">
                                <Avatar sx={{height: 40, width: 40}} alt="seller Image"
                                        src={'http://localhost:4941/api/v1/users/' + selectedAuction.sellerId + '/image'} />
                                <Typography variant="h5">
                                {selectedAuction.sellerFirstName + " " + selectedAuction.sellerLastName}
                                </Typography>
                            </Stack>
                            <Typography sx={{ pt: 2, pl: 3}} >
                                Ends: {selectedAuction.endDate.substring(0,10)} {selectedAuction.endDate.substring(12,19)}
                            </Typography>
                            <Typography sx={{ pt: 2, pl: 3}} >
                                {selectedAuction.description}
                            </Typography>
                            <Typography sx={{ pt: 2, pl: 3}} >
                                Reserve: ${selectedAuction.reserve}
                            </Typography>
                            <Typography sx={{pl: 3}} >
                            Number Of Bids: {selectedAuction.numBids}
                            </Typography>
                            <Typography sx={{pl: 3, pb:3}} >
                                Current Bid: {selectedAuction.highestBid === null ? "$0" : "$" + selectedAuction.highestBid}
                            </Typography>

                        </Card>
                        <Box sx={{pt:4, pb:4}}>

                        </Box>
                            <Container maxWidth="xs">
                                <Card sx={{height: '100%'}}>
                                    <Typography variant='h5' sx={{ml: 15}}> Place Bid</Typography>
                                    {!isNaN(currentUser) ?
                                    <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await bidSubmit(e)} sx={{mt: 1}}>
                                        <TextField sx={{ml: 3}} margin="normal" required type="number" label="Amount" name="bidAmount" id="bidAmount" autoFocus/>
                                        <Button type="submit"  variant="contained" sx={{marginTop: 3, ml: 3}}>
                                            Submit
                                        </Button>
                                        <div>
                                            <Typography sx={{color: 'red', pl:3, pb:3}}> {bidErrors} </Typography>
                                        </div>
                                    </Box>
                                        :  <Typography sx={{ pl:6, pb:3}}>
                                            Login or Register to make a bid!
                                        </Typography>}
                                </Card>
                            </Container>
                        <Box sx={{pt:4, pb:4}}>

                        </Box>
                        {selectedAuction.numBids !== 0 ?
                        <TableContainer component={Paper}>
                            <Typography variant="h5" align="center" sx={{pb:2, pt:2}}>Bid History </Typography>
                            <Table  size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>user</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bids.map((bid: Bid, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align="right">{bid.firstName} {bid.lastName}
                                                <Avatar sx={{height: 20, width: 20}} alt="Profile Image" src={'http://localhost:4941/api/v1/users/' + bid.bidderId+ '/image'}/>
                                            </TableCell>
                                            <TableCell align="right">${bid.amount}</TableCell>
                                            <TableCell align="right">{bid.timestamp.slice(0,10)} {bid.timestamp.slice(12,19)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer> :
                            <Typography variant="h5" align="center" sx={{pb:2, pt:2}}>No current bids</Typography>
                        }

                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Typography gutterBottom variant="h5" component="h2" align="center">Similar Auctions</Typography>
                    <Grid container spacing={4}>
                        {relatedAuctions.map((auction: Auction) => (
                            <Grid item key={auction.auctionId} xs={12} sm={6} md={4}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia component="img"
                                               height="200"
                                               image={'http://localhost:4941/api/v1/auctions/' + auction.auctionId + '/image'}
                                               alt="Auction image"
                                               onError={(event: SyntheticEvent<HTMLImageElement>) => event.currentTarget.src = defaultImage}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {auction.title}
                                        </Typography>

                                        <Typography>
                                            End date: {auction.endDate.slice(0,10)}
                                        </Typography>
                                        <Typography>
                                            <Avatar sx={{height: 25, width: 25, marginTop: 1}} alt="seller Image"
                                                    src={'http://localhost:4941/api/v1/users/' + auction.sellerId + '/image'} />
                                            {auction.sellerFirstName + " " + auction.sellerLastName}
                                        </Typography>
                                        <Typography>
                                            Current Bid: {auction.highestBid === null ? "$0" : "$" + auction.highestBid}
                                        </Typography>
                                        <Typography>
                                            Reserve: {auction.reserve}
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        <Link href={"/auctions/" + auction.auctionId}> View </Link>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>

            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Typography variant="h5" align="center" gutterBottom>
                    Auction365
                </Typography>
            </Box>
        </ThemeProvider>
    );
}

export default ViewAuction

