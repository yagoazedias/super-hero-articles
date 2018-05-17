import * as mongoose from 'mongoose';
import { User } from "../users/users.model";
import { Article } from "../articles/articles.model";

export interface Category extends mongoose.Document {
    name: string,
    users: Array<mongoose.Schema.Types.ObjectId> | Array<User>,
    articles: Array<mongoose.Schema.Types.ObjectId> | Array<Article>,
}

export const CategorySchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String,
        required: true
    },
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        ref: 'users',
    },
    articles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
        ref: 'articles',
        default: []
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
});


export const Category = mongoose.model<Category>('category', CategorySchema);
