# Project_3

# TravelWise

TravelWise is a vacation planner web app built with Node.js, Express, React, and MongoDB Native Driver.

## Authors

- Victor Cao
- Alexander Gutting

## YouTube Link

Link to video: 

## Slides Link

Link to slides: https://docs.google.com/presentation/d/1LRGQH1PeWUsOLd1OVKjYMY_GjrOJTNF30pzLbxQ_0P4/edit?slide=id.p#slide=id.p

## Project Objective

Users can register, log in, create travel plans, and search for possible places to travel to.

## Screenshot



## Tech Stack

- React
- Node.js
- Express
- MongoDB Native Node.js Driver
- Fetch API

## Setup

**Terminal 1 (Server)**
cd "/Users/alexgutting/Downloads/Project_3-main 3/server"
npm install
touch .env
npm start

**Terminal 2 (Client)**
cd "/Users/alexgutting/Downloads/Project_3-main 3/client"
npm install
npm run dev


## Important Notes

- This project does not use Mongoose, Axios, or CORS.
- This project does not use Vanilla JavaScript.
- This project defines PropTypes for every React Collection.

## Use of AI

We used Claude AI and ChatGPT to revise already written code, primarily for the .jsx files. Alex used Claude AI (Opus 4.8) for assistance on the passport.js and authentication. The specific prompts that Alex used was "How do I edit Login.jsx so that the user can successfully log in or create an account?", "Does it provide user authentication using Passport.js?", and "Does it include frontend integration with authentication APIs?".

Victor used Claude AI throughout the project as well. It started as a simple starting template for the frontend pages (Home, Travel Plans, Add Trip), based on early mockups. From there, Claude was mainly used to help debug backend issues, such as a MongoDB connection timing bug and a merge conflict that had accidentally dropped the authentication wiring from server.js. Claude was also used to write a script that automatically pulls destination images from Wikipedia's API to seed the database, instead of manually sourcing images one by one.
