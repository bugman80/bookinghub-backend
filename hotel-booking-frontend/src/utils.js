import { jwtDecode } from 'jwt-decode';

export const getUserData = () => {
    const token = localStorage.getItem("access");
    const decodedToken = token ? jwtDecode(token) : null;
    console.log(decodedToken)
    const userData = {
        id: decodedToken?.id,
        email: decodedToken?.email,
        firstname: decodedToken?.firstname,
        lastname: decodedToken?.lastname,
        superuser: decodedToken?.superuser
    };
    return userData;
};