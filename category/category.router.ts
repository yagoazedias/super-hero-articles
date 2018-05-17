import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import { Category } from './category.model'
import {User} from "../users/users.model";

class CategoryRouter extends ModelRouter<Category> {
    constructor(){
        super(Category);
        this.on('beforeRender', document => {
            this.preFormatter(document);
        })
    }

    private sortCategoriesByView(arr) {
        return arr.sort((a, b) =>
            (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0));
    }

    private getFirstTree(arr) {
        return arr.slice(0, 3)
    }


    preFormatter =  (document) => {
        document.articles.forEach((actual) => {
            actual.category = undefined;
        });

        document.users.forEach((actual) => {
            actual.category = undefined;
            actual.articles = undefined;
        });
    };

    findByAllStars = (req, resp, next) => {
        this.model.find()
            .populate({
                path:     'users',
                populate: { path:  'user',
                    model: User }
            })
            .populate('articles')
            .then(categories => {

                const categoriesOrdered = this.sortCategoriesByView(categories);
                const firstCategories = this.getFirstTree(categoriesOrdered);

                resp.send(firstCategories);
            })
            .catch(next)
    };

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate({
                path:     'users',
                populate: { path:  'user',
                    model: User }
            })
            .populate({
                path:     'articles',
                populate: { path:  'article',
                    model: User }
            })
            .then(this.render(resp, next))
            .catch(next)
    };

    findAll = (req, resp, next) => {
        this.model.find()
            .populate({
                path:     'users',
                populate: { path:  'user',
                    model: User }
            })
            .populate('articles')
            .then(this.renderAll(resp,next))
            .catch(next)
    };

    applyRoutes(application: restify.Server){
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/rockstars`, this.findByAllStars);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }

}

export const categoryRouter = new CategoryRouter();
