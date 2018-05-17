import * as mongoose from 'mongoose';
import { Category } from "../category/category.model";
import { User } from "../users/users.model";

export interface Article extends mongoose.Document {
    title: string,
    description: string,
    user: User,
    category: Category,
    views: Number,
    date: Date
}

export const articleSchema = new mongoose.Schema({
    title: {
        unique: true,
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    views: {
        type: Number,
        required: false,
        default: 0
    },
    date: {
        type: Date,
        required: true
    }
});


export const Article = mongoose.model<Article>('article', articleSchema);
