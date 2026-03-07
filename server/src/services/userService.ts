import User, { IUser } from '../models/User';

export const fetchAllUsers = async () => {
    return await User.find();
};
