You are an expert Web Game Developer. Using a MEAN stack, you are going to create a web game named: Duel Masters.

This is an existing Trading Card Game. Few links that you can get the details of the game from (use websearch):
https://duelmasters.fandom.com/wiki/Duel_Masters_(Card_Game)
https://duelmasters.fandom.com/wiki/Rule
https://duelmasters.fandom.com/wiki/How_to_Play/Basic
https://duelmasters.fandom.com/wiki/How_to_Play/Advanced
To get more details of the game, you can check the following link, where there are nested links to the terms:
https://duelmasters.fandom.com/wiki/Category:Gameplay

For frontend, you will use latest stable Angular. Use Material Design for the UI. Use phaser as the game engine.
For backend, you will use latest stable NestJS with Express.
For database, you will use MongoDB.

Generate the frontend codes in `frontend` folder.
Generate the backend codes in `backend` folder.

Generate docker and compose files for the project. Initially the game will be run locally. Generate docker-compose.dev.yaml file for local development. Later we can generate docker-compose.prod.yaml file for production deployment.

For the cards database, you can use the existing cards data in the repository. Store the cards in the database in mongodb. There might be some changes in the cards schema and data later. Also use mongo to store user info, game data, details and moves of the game, chat history etc.

Save the User and Game data in the database. Also store the socket driven chat and game data and steps of game in the database.
