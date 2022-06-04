import {SyntheticEvent, useState} from "react";
import * as React from "react";
import {useParams} from "react-router-dom";
import {getAllAuctions, getIndividualAuction, getAllBids} from "../../Service/AuctionService";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {Avatar, TextField} from "@mui/material";
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


const ViewAuction = () => {

    const {id} = useParams();
    const [selectedAuction, setSelectedAuction] = React.useState<AuctionIndividual>({auctionId: 0, title: "", category: 0, sellerId: 0, sellerFirstName: "",
                                                                            sellerLastName: "", reserve: 0, numBids: 0, highestBid: 0, endDate: "", description: ""})

    const [relatedAuctions, setRelatedAuctions] = React.useState<Array<Auction>>([])
    const [bids, setBids] = React.useState<Array<Bid>>([])

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

        setRelatedAuctions(similarCategory.concat(similarSeller))
    }



    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Box sx={{bgcolor: 'background.paper', pt: 8, pb: 6}}>
                    <Container maxWidth="sm">

                        <Card sx={{height: '100%'}}>
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
                                {selectedAuction.description}
                            </Typography>
                            <Typography sx={{ pt: 2, pl: 3}} >
                                Reserve: ${selectedAuction.reserve}
                            </Typography>
                            <Typography sx={{pl: 3}} >
                            Number Of Bids: {selectedAuction.numBids}
                            </Typography>
                            <Typography sx={{pl: 3, pb:3}} >
                                Current Bid: ${selectedAuction.highestBid}
                            </Typography>
                        </Card>
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

