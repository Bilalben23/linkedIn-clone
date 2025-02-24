import React from 'react'
import { NavLink } from 'react-router-dom'
import useLogout from '../../hooks/useLogout';

export default function Navbar() {
    const logout = useLogout();
    const signOut = () => {
        logout();
    }
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile">Profile</NavLink>
                    </li>
                    <button
                        type='button'
                        className='btn btn-secondary'
                        onClick={signOut}
                    >Logout</button>
                </ul>
            </nav>
        </header>
    )
}
