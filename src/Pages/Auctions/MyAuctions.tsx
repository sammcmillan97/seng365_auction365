import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import {SyntheticEvent} from "react";
import defaultImage from "../../Resources/Images/default image.png";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Link from "@mui/material/Link";
import * as React from "react";
import Button from "@mui/material/Button";
import {getAllAuctions} from "../../Service/AuctionService";
import {checkLoggedIn, getUser} from "../../Service/UserService";
import {useNavigate} from "react-router-dom";

const MyAuctions = () => {

    const navigate = useNavigate();
    const theme = createTheme();
    const [buying, setBuying] = React.useState<Array<Auction>>([])
    const [selling, setSelling] = React.useState<Array<Auction>>([])
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        getDetails()
    }, [])

    const getDetails = async () => {
        if (!checkLoggedIn()) {
            navigate("/auctions")
        }
        const userId = getUser();
        const auctionParamsSelling = {
            sellerId: userId
        }
        const sellingResponse = await getAllAuctions(auctionParamsSelling)
        setSelling(sellingResponse.data.auctions)

        const auctionParamsBuying = {
            bidderId: userId
        }
        const buyingResponse = await getAllAuctions(auctionParamsBuying)
        setBuying(buyingResponse.data.auctions)
    }

    const handleCreateAuction = () => {
        navigate("/auctions/create")
    }

    function deleteAuction (e: any) {
        setOpen(false);
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Box sx={{bgcolor: 'background.paper', pt: 8, pb: 6}}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h4" align="center" color="text.primary" gutterBottom>
                            Manage Auctions
                        </Typography>
                        <Stack sx={{ pt: 2 }} direction="row" spacing={2} justifyContent="center">
                            <Button variant="contained" onClick={handleCreateAuction}>Create Auction</Button>
                        </Stack>
                    </Container>
                </Box>

                <Container sx={{ py: 8 }} maxWidth="md">
                <Typography component="h1" variant="h4" align="center" color="text.primary" gutterBottom>
                    Im selling
                </Typography>
                    {selling.length === 0 ?
                        <Typography component="h1" variant="h5" align="center" color="text.primary" gutterBottom>
                            No current listings
                        </Typography> :
                        <Grid container spacing={4}>
                            {selling.map((auction: Auction) => (
                                <Grid item key={auction.auctionId} xs={12} sm={6} md={4}>
                                    <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                        <CardMedia component="img"
                                                   height="200"
                                                   image={'http://localhost:4941/api/v1/auctions/' + auction.auctionId + '/image'}
                                                   alt="Auction image"
                                                   onError={(event: SyntheticEvent<HTMLImageElement>) => event.currentTarget.src = defaultImage}
                                        />
                                        <CardContent sx={{flexGrow: 1}}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {auction.title}
                                            </Typography>

                                            <Typography>
                                                End date: {auction.endDate.slice(0, 10)}
                                            </Typography>
                                            <Typography>
                                                <Avatar sx={{height: 25, width: 25, marginTop: 1}} alt="seller Image"
                                                        src={'http://localhost:4941/api/v1/users/' + auction.sellerId + '/image'}/>
                                                {auction.sellerFirstName + " " + auction.sellerLastName}
                                            </Typography>
                                            <Typography>
                                                Current
                                                Bid: {auction.highestBid === null ? "$0" : "$" + auction.highestBid}
                                            </Typography>
                                            <Typography>
                                                Reserve: {auction.reserve}
                                            </Typography>

                                        </CardContent>
                                        <CardActions>
                                            <Link href={"/auctions/" + auction.auctionId} underline="none"> View/Edit/Delete </Link>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    }
                </Container>

                <Container sx={{ py: 8 }} maxWidth="md">
                    <Typography component="h1" variant="h4" align="center" color="text.primary" gutterBottom>
                        Im buying
                    </Typography>
                    {buying.length === 0 ?
                        <Typography component="h1" variant="h5" align="center" color="text.primary" gutterBottom>
                            No current bids
                        </Typography> :
                        <Grid container spacing={4}>
                            {buying.map((auction: Auction) => (
                                <Grid item key={auction.auctionId} xs={12} sm={6} md={4}>
                                    <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                                        <CardMedia component="img"
                                                   height="200"
                                                   image={'http://localhost:4941/api/v1/auctions/' + auction.auctionId + '/image'}
                                                   alt="Auction image"
                                                   onError={(event: SyntheticEvent<HTMLImageElement>) => event.currentTarget.src = defaultImage}
                                        />
                                        <CardContent sx={{flexGrow: 1}}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {auction.title}
                                            </Typography>

                                            <Typography>
                                                End date: {auction.endDate.slice(0, 10)}
                                            </Typography>
                                            <Typography>
                                                <Avatar sx={{height: 25, width: 25, marginTop: 1}} alt="seller Image"
                                                        src={'http://localhost:4941/api/v1/users/' + auction.sellerId + '/image'}/>
                                                {auction.sellerFirstName + " " + auction.sellerLastName}
                                            </Typography>
                                            <Typography>
                                                Current
                                                Bid: {auction.highestBid === null ? "$0" : "$" + auction.highestBid}
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
                    }
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

export default MyAuctions