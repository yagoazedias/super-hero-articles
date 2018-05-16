import * as mongoose from 'mongoose';
import { Category } from "../category/category.model";
import { User } from "../users/users.model";

export interface Article extends mongoose.Document {
    title: string,
    description: string,
    user: User,
    category: Category,
    views: Number
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
        required: false
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
        required: true
    },
    views: {
        type: Number,
        required: false
    }
});


export const Article = mongoose.model<Article>('article', articleSchema);
