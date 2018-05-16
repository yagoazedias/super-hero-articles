import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import {Article} from './articles.model'

class ArticlesRouter extends ModelRouter<Article> {
    constructor(){
        super(Article)
    }

    // Callback na função de render, servirá para atualizar as views do category
    print = (document) =>
        console.log(document);

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate('category')
            .populate('user')
            .then(this.render(resp, next, this.print))
            .catch(next)
    };

    findAll = (req, resp, next) => {
        this.model.find()
            .populate('category')
            .populate('user')
            .then(this.renderAll(resp,next))
            .catch(next)
    };

    applyRoutes(application: restify.Server){
        application.get('/articles', this.findAll);
        application.get('/articles/:id', [this.validateId, this.findById]);
        application.post('/articles', this.save);
        application.put('/articles/:id', [this.validateId,this.replace]);
        application.patch('/articles/:id', [this.validateId,this.update]);
        application.del('/articles/:id', [this.validateId,this.delete]);
    }

}

export const articlesRouter = new ArticlesRouter();
