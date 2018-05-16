import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import { Category } from './category.model'

class CategoryRouter extends ModelRouter<Category> {
    constructor(){
        super(Category)
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate('users',)
            .populate('articles')
            .then(this.render(resp, next))
            .catch(next)
    };

    findAll = (req, resp, next) => {
        this.model.find()
            .populate('users',)
            .populate('articles')
            .then(this.renderAll(resp,next))
            .catch(next)
    };

    applyRoutes(application: restify.Server){
        application.get('/categories', this.findAll);
        application.get('/categories/:id', [this.validateId, this.findById]);
        application.post('/categories', this.save);
    }

}

export const categoryRouter = new CategoryRouter();
