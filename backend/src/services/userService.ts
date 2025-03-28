import User, { IUser } from '../models/userModel';

export interface GoogleUserData {
    sub?: string;
    id?: string;
    name: string;
    email: string;
    picture?: string;
    locale?: string;
}

export const findOrCreateGoogleUser = async (userData: GoogleUserData): Promise<IUser> => {
    const googleId = userData.sub || userData.id;
    if (!googleId) {
        throw new Error('Google ID not found');
    }

    try {
        let user = await User.findOne({googleId});

        if (user) {

            user.lastLogin = new Date();
            user.name = userData.name;
            if (userData.picture) {
                user.picture = userData.picture;
            }
            if (userData.locale) {  
                user.locale = userData.locale;
            }
            await user.save()
        } else {
            user = await User.create({
                googleId,
                name: userData.name,
                email: userData.email,
                picture: userData.picture,
                locale: userData.locale,
            });
        }

        return user;
    } catch (error) {
        console.error('Error finding or creating user:', error);
        throw error;
    }
};

export const findUserById = async (userId: string): Promise<IUser | null> => {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  };
  
  export const findUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
    try {
      return await User.findOne({ googleId });
    } catch (error) {
      console.error("Error finding user by Google ID:", error);
      throw error;
    }
  };
  
  export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  };