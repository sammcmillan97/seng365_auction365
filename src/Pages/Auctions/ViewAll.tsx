import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {getAllAuctions} from "../../Service/AuctionService";
import {SyntheticEvent} from "react";
import defaultImage from "../../Resources/Images/default image.png";
import {Avatar, TextField} from "@mui/material";


const ViewAll = () => {


    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [searchQuery, setSearch] = React.useState("")

    React.useEffect(() => {
        getAuctions()
    }, [])

    const getAuctions = async () => {
        const auctionParams = {
            q: searchQuery
        }

        const response = await getAllAuctions(auctionParams)
        setAuctions(response.data.auctions)
    }

    const theme = createTheme();


    function handleSearch(value: string) {
        setSearch(value)
        getAuctions()
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Box sx={{bgcolor: 'background.paper', pt: 8, pb: 6,}}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
                            Auctions
                        </Typography>
                        <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
                            <TextField id="standard-basic" label="Search" variant="standard" onChange={(e) => {handleSearch(e.target.value); } } />
                        </Stack>
                    </Container>
                </Box>

                <Container sx={{ py: 8 }} maxWidth="md">
                    <Grid container spacing={4}>
                        {auctions.map((auction: Auction) => (
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

export default ViewAll;