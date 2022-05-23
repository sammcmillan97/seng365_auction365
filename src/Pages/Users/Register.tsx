import axios from "axios"
import { Link } from "react-router-dom"

const Register = () => {
    return (
        <div>
        <h1>Register</h1>
        <Link to={"/users/login"}>Back to login</Link>
    </div>
    )
}
export default Register