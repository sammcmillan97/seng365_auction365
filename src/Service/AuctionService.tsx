import axios from 'axios';
import {AuctionParams} from "../Types/auctionParams";
import Cookies from "js-cookie";

const baseURL = "http://localhost:4941/api/v1/"

const getIndividualAuction = async (auctionId: string) => {

    return axios.get(baseURL + "auctions/" + auctionId)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
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

const createAuction = async (body: any) => {

    const config = getConfig()

    return await axios.post(baseURL + "auctions",body, config)
        .then((response) => {
        return response;
    })
        .catch((error) => {
            return error.response;
        })
}

const placeBid = async(auctionId: number, bidAmount: number) => {

    const config = getConfig()

    const body = {
        amount: bidAmount
    }

    return await axios.post(baseURL + "auctions/" + auctionId + "/bids" , body, config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
}

const deleteAuction = async(auctionId: number) => {

    const config = getConfig()

    return await axios.delete(baseURL + "auctions/" + auctionId, config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
}

const editAuction = async (body: any, auctionId: number) => {

    const config = getConfig()

    return await axios.patch(baseURL + "auctions/" + auctionId, body, config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
}

const uploadAuctionImage = async (auctionId: number, imageData: any) => {

    const config = getConfigWithImage(imageData.type)

    return await axios.put(baseURL + "auctions/" + auctionId + "/image", imageData, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        })
}

const getConfig = (): any => {
    return {
        headers: {
            "X-Authorization": Cookies.get("Token") || ""
        }
    };
}

const getConfigWithImage = (imageType: String): any => {
    if (imageType === "image/jpg") {
        imageType = 'image/jpeg'
    }
    return {
        headers: {
            "Content-type": imageType,
            "X-Authorization": Cookies.get("Token") || ""

        }
    }
}

export{getAllAuctions, getIndividualAuction, getAllBids, getCategories, createAuction, uploadAuctionImage, editAuction,
        deleteAuction, placeBid}
