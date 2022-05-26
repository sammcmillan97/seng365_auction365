import {MenuItems} from "./MenuItems";
import "./NavBar.css";
import GavelIcon from '@mui/icons-material/Gavel';
import {checkLoggedIn} from "../../Service/UserService";
import * as React from 'react';
import {useEffect} from "react";




const NavBar = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isLogged, setLogged] = React.useState(false)

    useEffect(() => {
        const refresh = () => {
            setLogged(checkLoggedIn)
        }

        refresh()
    }, [])


        return(
            <nav className="NavbarItems">
                <div className="menu-icon">
                    <GavelIcon/>
                </div>
                <h1 className="navbar-logo">Auction365</h1>
                <ul className='nav-menu'>
                    {MenuItems.map((item, index) => {
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