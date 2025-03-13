import { createContext, useState } from 'react'

export const AuthContext = createContext();

const INITIAL_STATE = {
    user: null,
    accessToken: null,
    isAuthenticated: false
}

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState(INITIAL_STATE);

    const login = (user, accessToken) => {
        setAuthState({
            user,
            accessToken,
            isAuthenticated: true
        })

    }

    const logout = () => {
        setAuthState(INITIAL_STATE);
    }

    const updateProfileImage = (newProfilePicture) => {
        setAuthState(prevState => ({
            ...prevState,
            user: {
                ...prevState.user,
                profilePicture: newProfilePicture
            }
        }))
    }

    return (
        <AuthContext.Provider value={{
            authState,
            login,
            logout,
            updateProfileImage
        }}>
            {children}
        </AuthContext.Provider>
    )
}
