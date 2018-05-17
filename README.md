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
