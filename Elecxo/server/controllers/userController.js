const userModel  = require("../models/usermodels");
const bcrypt = require('bcrypt');
const generateToken = require("../utils/generatetoken");


const loginuser=async(req,res)=>{
    const {email,password} =req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

       // Generate a JWT using the utility function
    const token = generateToken({ userId: user._id });

        res.status(200).json({message:'login success', token, user: { id: user._id, username: user.username,firstName:user.firstName ,lastName:user.lastName ,email:user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    
  
}

const register=async(req,res)=>{
try {
    const {name,email,password}=req.body;
    console.log(name,email,password);
    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
        return res.json({ success: false, message: "User already exists" })
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      

      
     // Generate a JWT using the utility function
    const token = generateToken({ userId: newUser._id });

    return res.status(200).json({message:'user registered success',user:newUser,token:token})
    
} catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
}
}



module.exports={loginuser,register}

