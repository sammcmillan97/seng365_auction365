
import "./NavBar.css";
import GavelIcon from '@mui/icons-material/Gavel';
import * as React from 'react';
import {MenuItems} from "./MenuItems"




const NavBar = () => {

    return(
            <nav className="NavbarItems">
                <div className="menu-icon">
                    <GavelIcon/>
                </div>
                <a href={"/auctions"}>
                <h1 className="navbar-logo">Auction365</h1>
                </a>
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