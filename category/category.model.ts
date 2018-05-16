import * as mongoose from 'mongoose';
import { User } from "../users/users.model";
import { Article } from "../articles/articles.model";

export interface Category extends mongoose.Document {
    date: Date,
    name: string,
    users: Array<mongoose.Schema.Types.ObjectId> | Array<User>,
    articles: Array<mongoose.Schema.Types.ObjectId> | Array<Article>,
}

const CategorySchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String,
        required: true
    },
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        ref: 'users',
        required: false
    },
    articles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
        ref: 'articles',
        required: true
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
});


export const Category = mongoose.model<Category>('category', CategorySchema);
