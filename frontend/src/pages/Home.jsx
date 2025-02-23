import React from 'react';
import useAuth from '../hooks/useAuth';

export default function Home() {

    const { authState } = useAuth();
    console.log(authState);

    return (
        <div>
            Home page goes here
        </div>
    )
}
