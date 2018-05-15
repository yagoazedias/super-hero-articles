import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import {Article} from './articles.model'

class ArticlesRouter extends ModelRouter<Article> {
  constructor(){
    super(Article)
  }

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
