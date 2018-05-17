import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { environment } from '../common/environment'
import { Article } from "../articles/articles.model";
import { Category } from "../category/category.model";

export interface User extends mongoose.Document {
    name: string,
    email: string,
    lastPost: Date,
    password: string,
    articles: Array<mongoose.Schema.Types.ObjectId> | Array<Article>,
    categories: Array<mongoose.Schema.Types.ObjectId> | Array<Category>,
}

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    lastPost: {
        type: Date,
        default: null
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    articles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
        ref: 'articles',
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
});

const hashPassword = (obj, next)=>{
    bcrypt.hash(obj.password, environment.security.saltRounds)
        .then(hash=>{
            obj.password = hash;
            next()
        }).catch(next)
};

const saveMiddleware = function (next){
    const user: User = this;
    if(!user.isModified('password')){
        next()
    }else{
        hashPassword(user, next)
    }
};

const updateMiddleware = function (next){
    if(!this.getUpdate().password){
        next()
    }else{
        hashPassword(this.getUpdate(), next)
    }
};

userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);

export const User = mongoose.model<User>('user', userSchema);
