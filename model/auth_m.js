import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
});

let flag = false;
let count = 0;

authSchema.pre('save', async function (next) {
    if (flag === false) {
        console.log(this.password + '*-*-+-+--+');
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(this.password);
        count++;
        console.log(count + '****');
        flag = true;
        next();
    }
});

authSchema.methods.createJWT = function () {
    return jwt.sign(
        { userID: this.id, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
}

authSchema.methods.comparePassword = async function (candidatePassword) {
    console.log(flag);
    console.log(count);
    console.log(candidatePassword, '++');
    console.log(this.password, '--');
    const isMatch = await bcrypt.compare
        (candidatePassword, this.password);
    console.log(isMatch);
    return isMatch;
}

export default mongoose.model('Auth', authSchema);