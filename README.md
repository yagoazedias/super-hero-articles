# Super-hero-articles

- Super heroes article is just a simple challenger to test the knowledge and the ability of create a REST api with Typescript, moongoDB and restify


## Setup:
1. Make sure that you have nodejs installed in your machine:
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
2. Check the mongodb instalation [How to install mongodb in debian based systems](https://www.digitalocean.com/community/tutorials/como-instalar-o-mongodb-no-ubuntu-16-04-pt)

3. Clone the respository and install all dependencies:
```
git clone https://github.com/yagoazedias/super-hero-articles && cd super-hero-articles && npm install
```

4. Run typescript transpiler:
- You have to run typescript transpiler before start the server, so open a new terminal window and run the following command inside of `super-hero-articles` project folder:

```
  npm run tsc
```

5. Startup the server:
- Open a new terminal window and run the following command to start the server
```
  npm start
```

## Rules
- The API only allow the following actions:
    - Register users, categories and articles and retrieve them by their ObjectID;
    - List all articles by category or provider;
    - List users who did not post content in the last month
    - List the 3 categories with the most article views

### Articles:
 - Articles are always related to one category and to one user. If a user try to create a article that does not match with its category, the server will return status `400`;

 
### Users
 - All users have a category as required property.
 - An user is able to write multiples articles, 
   as long as them match with their category.
   
### Category
 - Category is a required property for both of `user` and `article` documents. So it must to be the first document to be created.
 
## Collections
- [Insomnia](https://mega.nz/#!Eh50wZqK!cnntUpIvBYaK8jWdViS-R5dZLfUkAITti6myvdkaTJY)
- [Postman](https://mega.nz/#!xlpEEZCI!kD0UWvY7lsrQ_ZLLPK3MXbvLJwoJa9gadMFmI1_897E)
 
## Endpoints:

### User
 -  Get All users with pagination
    - GET `http://localhost:5000/users?_page=1&_count=1`
    
    
 -  Create a new user  
     - POST - `http://localhost:5000/users`
        ```json
        {
            "name": "K-el",
            "email": "superman@dc.com",
            "category": {{categoryId}}
        }
        ```
 -  Get an user by its `id`:
    - GET - `http://localhost:5000/users/:id`
 
 -  Get all users that have not posted in the last month:
    - GET - `http://localhost:5000/users/irregular`
    
### Articles
 -  Get All articles with pagination
    - GET `http://localhost:5000/articles?_page=1&_count=1`
    
    
 -  Create a new article  
     - POST - `http://localhost:5000/articles`
        ```json
        {
            "title": "Como ser o batman",
            "description": "Diga repetidas vezes que você é o batman",
            "user": {{userId}},
            "category": {{userCategory}},
            "date": "Thu May 17 2018 00:54:47 GMT-0300 (BRT)"
        }
        ```
 -  Get an article by its `id`:
    - GET - `http://localhost:5000/article/:id`
 
 -  Get all articles by `user`:
    - GET - `http://localhost:5000/articles?user={{userId}}`

 -  Get all articles by `category`:
    - GET - `http://localhost:5000/articles?category={{categoryId}}`

### Category
 -  Get All category with pagination
    - GET `http://localhost:5000/articles?_page=1&_count=1`
    
    
 -  Create a new category  
     - POST - `http://localhost:5000/articles`
        ```json
        {
        	"name": "Voadores",
        	"views": 0
        }
        ```
 -  Get a category by its `id`:
    - GET - `http://localhost:5000/categories/:id`
 
 -  Get all category by `user`:
    - GET - `http://localhost:5000/categories?user={{userId}}`

 -  Get the rockstars categories (the first three):
    - GET - `http://localhost:5000/categories/rockstars`
