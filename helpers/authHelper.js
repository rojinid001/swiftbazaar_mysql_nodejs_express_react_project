import bcrypt from 'bcrypt';

export const hashedPassword = async (password) => {
  try {
 
    const saltRounds = 10;
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw error; 
  }
};
export const comparePasswords = async (plainTextPassword, hashedPassword) => {  
    try {
      const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  
      return isMatch;
    } catch (error) {
      console.log(error);
      throw error; 
    }
  };
  