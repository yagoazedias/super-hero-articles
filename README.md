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
 
 