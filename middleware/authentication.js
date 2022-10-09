import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import { isTokenValid } from "../utils/index.js";

const authenticateUser = async (req, res, next) => {
    // console.log(req);
    console.log(req.signedCookies);
    console.log(req.signedCookies.token);
    console.log('+++');
    const token = req.signedCookies.token;

    if (!token) {
        throw new UnauthenticatedError('Authentication Invalid');
    }

    try {

        const { plyload } = isTokenValid({ token });
        req.user = { name: plyload.name, userId: plyload.userId, role: plyload.role };

        console.log(req.user);
        console.log(req.user.userId);
        console.log('-+--');
        console.log(req.user.role);
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
};


const authorizePermissions = (...roles) => {

    return (req, res, next) => {
        console.log('***');
        console.log(req.user.role);
        console.log('--');
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};

export { authenticateUser, authorizePermissions };