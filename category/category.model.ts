import * as mongoose from 'mongoose';
import { User, userSchema } from "../users/users.model";
import { Article, articleSchema } from "../articles/articles.model";
import { articlesRouter } from "../articles/articles.router";

export interface Category extends mongoose.Document {
    date: Date,
    name: string,
    users: Array<mongoose.Schema.Types.ObjectId> | Array<User>,
    articles: Array<mongoose.Schema.Types.ObjectId> | Array<Article>,
}

const CategorySchema = new mongoose.Schema({
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        ref: 'users',
        required: true
    },
    articles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
        ref: 'articles',
        required: true
    },
    name: {
        type: String,
        required: true
    },
});


export const Category = mongoose.model<Category>('category', CategorySchema);
