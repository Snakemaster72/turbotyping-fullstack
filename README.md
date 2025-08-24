# TurobyTyping - A Typing Website Project

Turbotyping  is a full-stack typing game which allows both single-player and multi-player modes. Turbotyping provides useful user stats and analytics which will help users track their progress. It also provides leaderboard and also player-player stats for multiplayer games. 

## Key Features

- User Registration and JWT authentication (without auth user stats won't be saved).
- SinglePlayer Mode with 2 types of mode: Word Count based and timer based.
- Gives match stats such as wpm, raw wpm, accuracy and also a graph view(not done).
- *NOT COMPLETE* Multiplayer Room creation has been set up using web sockets with live updates of players joining the games, player waiting for the game to start.
- Prompts generated from the an array of words and taken at random.
- Dynamic word generation not supported yet (just generate a large amount of words).


## Tech Stack

- Frontend: React, Redux Toolkit (state management), Socket.io client, Axios, Tailwind.
- Backend: Node.js, Express, Mongoose, Socket.io, JWT
- Database: MongoDB

## Setup and Installation

If you want to run locally
- Clone the repo.
    ``` bash
    git clone https://github.com/Snakemaster72/turbotyping-fullstack
    ```
- Navigate to the server and install the packages

- Create .env file and the require variables (MONGO_URI, JWT_SECRET, PORT).

- Navigate to client and install the packages

- Create an .env file and add suitable variables 

- Finally go back to the project root directory and start the server.