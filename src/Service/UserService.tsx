import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "http://localhost:4941/api/v1/"

const login = async (email:string , password: string) => {

    return await axios.post( baseURL + "users/login", { password: password, email: email })
        .then((response) => {
            Cookies.set('UserId', response.data.userId)
            Cookies.set('Token', response.data.token)
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}

const register = async (firstName: string, lastName: string, email:string, password: string) => {

    return await axios.post(baseURL + "users/register", {
            firstName: firstName,
            lastName: lastName,
            password: password,
            email: email
            })
        .then((response) =>
    {
        return response.status;
    })
    .catch((error) => {
        console.log(error)
        return error.response.status;
    })
}

const checkLoggedIn = (): boolean => {
    const userId = Cookies.get('UserId')
    return !(userId === undefined || userId === null);
}


export{login, register, checkLoggedIn}