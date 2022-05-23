import React, {Component} from "react";
import {MenuItems} from "./MenuItems";
import "./NavBar.css";


class NavBar extends Component {

    render() {
        return(
            <nav className="NavbarItems">
                <div className="menu-icon">
                    Add Icon
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
}

export default NavBar