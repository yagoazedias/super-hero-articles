import {Server} from './server/server'
import {usersRouter} from './users/users.router'
import {articlesRouter} from './articles/articles.router'
import {categoryRouter} from './category/category.router'

const server = new Server();

server.bootstrap([
    usersRouter,
    articlesRouter,
    categoryRouter
]).then(server=>{
    console.log('Server is listening on:', server.application.address())
}).catch(error=>{
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)
})
