import Message from "../models/messgae.model.js";
import User from "../models/user.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersFromSidebar = async (req, res) => {
    try {
        const userLoggedId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: userLoggedId } }).select("-password");
        res.status(200).json(filterUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id:chatId} = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: chatId },
                { senderId: chatId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        // console.log("Request Body:", req.body);
        // console.log("Receiver ID:", req.params.id);
        // console.log("User Data:", req.user);


        const { text, image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user?._id;

        let imageurl;
        if(image){
            const uploadImgResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadImgResponse.secure_url;
        } 
        
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageurl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        res.status(200).json(newMessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};