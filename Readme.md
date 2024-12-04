# CSCI-3308 Group Project 012-4 

## Brief Application Description
The goal of our application is to allow trading card collectors to be able to find the value of their cards by searching it up in our application and getting its value. The users will be able to login, save their cards into a collection and trade cards with other users on the platform.

It will be limited to Pokemon cards due to API reasons however our intention is to eventually make it for all card users. Therefore collectors of all TCGs will be able to participate and trade through the website.

## Contributors
* Virtual-B - Ben Javier
* jellyboxmeow - Alan La
* MasonLee400 - Mason Lee
* klnguyen02 - Kristina Nguyen
* ericpettersson101 - Eric Pettersson

## Technology Stack
* Front-End: HTML, CSS, Handlebars, JS
* Back-End: NodeJS
* Server Hosting: Render

## Prerequisites to run the application locally
Need to have Docker Desktop, VScode installed.\
If possible, run VSCode through the WSL terminal.
Docker Desktop needs to be open to be able to run locally.\
In VScode, go into the folder ProjectSourceCode and create a (.env) file with similar content:

POSTGRES_USER="postgre"\
POSTGRES_PASSWORD="pwd"\
POSTGRES_DB="users_db"\
SESSION_SECRET="super duper secret!"\
API_KEY=<Your_API_key>\
host="db"

After successfully creating the (.env) file, proceed to the VScode terminal (make sure you are in the ProjectSourceCode folder) and type the command:\
docker compose up

This will run the test as well as let you be able to run the website locally (on localhost:3000)

Once you are done, run the command:\
docker compose down -v

## How to run the tests
To run the test you need to have been able to complete the prerequisites to run the application locally.

After running the command:\
docker compose up

You will see the test run and that is how you run the tests

## Link to the deployed application
The [deployed application](https://csci-3308-group4project.onrender.com)

## Link to the Video
The [video](https://www.youtube.com/watch?v=bNY5wNIz8ng&ab_channel=KristinaNguyen)