import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import { Category } from './category.model'

class CategoryRouter extends ModelRouter<Category> {
  constructor(){
    super(Category)
  }

  applyRoutes(application: restify.Server){
    application.get('/category', this.findAll);
    application.get('/category/:id', [this.validateId, this.findById]);
    application.post('/category', this.save);
  }

}

export const categoryRouter = new CategoryRouter();
