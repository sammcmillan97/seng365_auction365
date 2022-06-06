
import "./NavBar.css";
import GavelIcon from '@mui/icons-material/Gavel';
import * as React from 'react';
import {LoggedInMenuItems, LoggedOutMenuItems} from "./MenuItems"
import {useState} from "react";
import {checkLoggedIn} from "../../Service/UserService";




const NavBar = () => {

    const [loggedIn, setLoggedIn] = useState(false)

    React.useEffect(() => {
        const getDetails = () => {
            if (checkLoggedIn()) {
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
        }

        getDetails()
    }, [])


    return(
            <nav className="NavbarItems">
                <div className="menu-icon">
                    <GavelIcon/>
                </div>
                <a href={"/auctions"}>
                <h1 className="navbar-logo">Auction365</h1>
                </a>
                <ul className='nav-menu'>
                    {loggedIn ?
                    LoggedInMenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <a className={item.cName} href={item.url}>
                                {item.title}
                                </a>
                            </li>
                        )
                    }) : LoggedOutMenuItems.map((item, index) => {
                            return (
                                <li key={index}>
                                    <a className={item.cName} href={item.url}>
                                        {item.title}
                                    </a>
                                </li>
                            )
                        })}
                </ul>
            </nav>
        )
}

export default NavBar