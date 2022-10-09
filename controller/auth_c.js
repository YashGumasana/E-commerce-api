import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import Auth from "../model/auth_m.js";
import { createTokenUser, attachCookiesToResponse } from "../utils/index.js";



const register = async (req, res) => {

    const { email, name, password, role } = req.body;

    // const isFirstAccount = (await Auth.countDocuments({})) === 0;

    // console.log(isFirstAccount);

    // const role = isFirstAccount ? 'admin' : 'user';
    // console.log(role);


    const user = await Auth.create({ name, email, password, role });
    console.log('***');
    console.log(user);
    console.log('--');

    const tokenUser = createTokenUser(user);
    console.log(tokenUser);
    console.log('***');

    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('please provide email and password');
    }

    const user = await Auth.findOne({ email });

    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials user not found');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials password is not correct');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}


const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    }).status(StatusCodes.OK).json({ msg: 'user logged out!' });
    console.log(req.cookies);
};


export { login, register, logout };