import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Name is required"],
        trim : true
    },
    email : {
        type : String,
        required : [true,"Email is required"],
        lowercase : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    avatar : {
        type : String,
        required :true
    },
    role : {
        type : String,
        enum : ['ADMIN','USER'],
        default : 'USER'
    },
    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Course',
        }
    ]
},{
    timestamps : true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(textPassword){
    return await bcrypt.compare(textPassword,this.password)
}

userSchema.methods.generateJwt = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            password : this.password,
            courses : this.courses
        },
        process.env.JWTSECRET,
        {expiresIn : 7*24*60*60*1000}
    )
}

const User = mongoose.model('User',userSchema)

export default User