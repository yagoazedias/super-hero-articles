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

    findRockstars = (req, resp, next) => {
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

        let page = parseInt(req.query._page || 1);
        page = page > 0 ? page : 1;

        if(req.query._count)
            this.pageSize = parseInt(req.query._count, 10);

        const skip = (page - 1) * this.pageSize;
        
        this.model
            .count({})
            .exec()
            .then((count) =>
                this.model
                    .find()
                    .populate({
                        path:     'users',
                        populate: { path:  'user',
                            model: User }
                    })
                    .populate('articles')
                    .skip(skip)
                    .limit(this.pageSize)
                    .populate('category')
                    .then(this.renderAll(resp, next,
                        {
                            page, count, pageSize: this.pageSize, url: req.url
                        })))
            .catch(next)
    };

    applyRoutes(application: restify.Server){
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/rockstars`, this.findRockstars);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }

}

export const categoryRouter = new CategoryRouter();
