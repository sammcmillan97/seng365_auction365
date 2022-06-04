import axios from 'axios';
import {AuctionParams} from "../Types/auctionParams";

const baseURL = "http://localhost:4941/api/v1/"

const getIndividualAuction = async (auctionId: string) => {

    return axios.get(baseURL + "auctions/" + auctionId)
}

const getAllAuctions = async (params: AuctionParams) => {
    return axios.get(baseURL + "auctions", { params: params})
}

const getAllBids = async (auctionId: string) => {
    return await axios.get(baseURL + "auctions/" + auctionId + "/bids")
}

const getCategories = async () => {
    return await axios.get(baseURL + "auctions/categories")
}


export{getAllAuctions, getIndividualAuction, getAllBids, getCategories}
