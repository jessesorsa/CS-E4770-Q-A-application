### Course Project II - Question and Answer service

This project was made as a part of the Aalto University course CS-E4770. 

## Description
Qanda is a question and answer platform where users can ask questions on specific courses, and also answer questions others have submitted. Questions and answers can be upvoted, and the messages are sorted based on number of upvotes and post times. The application also has an llm functionality. Each time a user submits a question, the llm generates three answers. The application supports multiple users and real time/automatic communication updates. 

## Technical details
- Styling with tailwindcss and daisyUI
- Front end with Svelte and Astro
- Communications with http and websockets for real time updates
- Implemented functionalities include:
1. Infinite scrolling
2. Restricted posting (time limits for post frequency)
3. Restricted upvotes per user

- Backend built with Deno
- Redis cache
- Postgresql database
- Asynchronous llm answer generation

- Docker for containerization
- Uncompleted Kuberentes configuration for container orchrestation