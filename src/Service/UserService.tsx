import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = "http://localhost:4941/api/v1/"

const retrieveUser = async (id: string) => {

    const config = getConfig();
    return await axios.get(baseURL + "users/" + id, config)
        .then((response) => {
            return response
        })
        .catch((error) => {
            return error.response.status;
        })
}

const login = async (email:string , password: string) => {

    return await axios.post( baseURL + "users/login", { password: password, email: email })
        .then((response) => {
            Cookies.set('UserId', response.data.userId)
            Cookies.set('Token', response.data.token)
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        })
}

const logout = async () => {

    const config = getConfig()

    return await axios.post(baseURL + 'users/logout', {}, config)
        .then((response) => {
            Cookies.remove('UserId')
            Cookies.remove('Token')
            return response.status;
        })
        .catch((error) => {
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
        return error.response.status;
    })
}

const update = async (id: string, firstName: string, lastName: string, email: string, oldPassword: string, newPassword: string) => {

    const config = getConfig()
    let body

    if(newPassword === "") {
        body = {
            firstName: firstName,
            lastName: lastName,
            email: email
        }
    } else {
        body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            currentPassword: oldPassword,
            password: newPassword
        }
    }

    return await axios.patch(baseURL + "users/" + id, body, config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
}

const uploadUserImage = async (imageData: any) => {
    const id = Cookies.get('UserId')
    const config = getConfigWithImage(imageData.type)

    return await axios.put(baseURL + "users/" + id + "/image", imageData, config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
}

const deleteUserImage = async () => {
    const id = Cookies.get('UserId')
    const config = getConfig()

    return await axios.delete(baseURL + "users/" + id + "/image", config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
}

const retrieveUserImage = (id: string) => {
    return baseURL + "users/" + id + "/image"
}



const checkLoggedIn = (): boolean => {
    const userId = Cookies.get('UserId')
    return !(userId === undefined || userId === null);
}

const checkCorrectUser = (userId: string): boolean => {
    const cookieId = Cookies.get('UserId') as string
    return (userId === cookieId)
}

const getUser = (): number => {
    return parseInt(Cookies.get('UserId') as string);
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

const getConfig = (): any => {
    return {
        headers: {
            "X-Authorization": Cookies.get("Token") || ""
        }
    };
}

export{login, register, retrieveUser, update, uploadUserImage, retrieveUserImage, deleteUserImage, checkLoggedIn, logout, getUser, checkCorrectUser}