import * as mongoose from 'mongoose';
import { User } from "../users/users.model";
import { Article } from "../articles/articles.model";

export interface Category extends mongoose.Document {
    date: Date,
    name: string,
    users: Array<mongoose.Types.ObjectId> | Array<User>,
    articles: Array<mongoose.Types.ObjectId> | Array<Article>,
}

const CategorySchema = new mongoose.Schema({
    users: {
        type: Array,
        ref: 'User',
        required: true
    },
    articles: {
        type: Array,
        ref: 'Article',
        required: true
    },
    name: {
        type: String,
        required: true
    },
});


export const Category = mongoose.model<Category>('Category', CategorySchema);
