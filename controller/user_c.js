import Auth from "../model/auth_m.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";
import checkPermissions from "../utils/checkPermission.js";
import BadRequestError from "../errors/bad-request.js";
import createTokenUser from "../utils/createTokenUser.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import UnauthenticatedError from "../errors/unauthenticated.js";

const getAllUsers = async (req, res) => {
    const users = await Auth.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getSingleUser = async (req, res) => {
    const user = await Auth.findOne({ _id: req.params.id }).select('-password');

    console.log(user);

    if (!user) {
        throw new NotFoundError(`No user with id : ${req.params.id}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
};


const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
}

const updateUser = async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        throw new BadRequestError('Please provide all values');
    }
    const user = await Auth.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;

    await user.save();

    const tokenUser = createTokenUser(user);
    console.log(user.password + ":::::");
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({ user: tokenUser });

}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new BadRequestError('Please provide both values');
    }

    const user = await Auth.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    user.password = newPassword;

    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

export { getAllUsers, getSingleUser, updateUser, showCurrentUser, updateUserPassword };