import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TokenHandler = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token && token !== 'null' && token !== 'undefined') {
            console.log("TokenHandler: Saving token and redirecting");
            localStorage.setItem('lexfix_token', token);
            // Full refresh to ensure all components see the new token in storage
            window.location.href = '/';
        }
    }, [location]);

    return children;
};

export default TokenHandler;
