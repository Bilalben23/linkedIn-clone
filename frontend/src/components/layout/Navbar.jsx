import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/signin">Signin</NavLink>
                    </li>
                    <li>
                        <NavLink to="/signup">Signup</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
