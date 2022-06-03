import axios from 'axios';

const baseURL = "http://localhost:4941/api/v1/"

const getAllAuctions = async () => {

    return axios.get(baseURL + "auctions")
}

export{getAllAuctions}
