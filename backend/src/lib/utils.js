import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('token', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });

    return token;
}