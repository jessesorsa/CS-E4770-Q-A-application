TODO: There is a brief description of the application in REFLECTION.md that highlights key design decisions for the application. The document also contains a reflection of possible improvements that should be done to improve the performance of the application.

### Application reflection

## Key design decisions

# Frontend
- Frontend of the application is built with astro and svelte
- Frontend is styled with DaisyUI
- Svelte store and LocalStorage are used on the frontend to manage state
- Frontend communicates with the backend api primarily through http calls
- Frontend receives updates also through websocket: As users send questions or answers to the platform, they are then sent to all users who have that specific course/question page open on their own browser using websockets. It allows real time messages
- Infinite scrolling is setup for questions and answer pages. This allows for large amount of messages to be loaded incrementally. The current offset (how many results are already loaded) is sent to the backend for correct data fetching


# Backend
- llm api is set up as a python server and it communicates with the qa api through http
- Calls to the llm api are handled as follows in the qaController.js in qa-api:  

        const result = await questionService.postQuestion(data.course_id, data.user_uuid, data.question);

        setTimeout(() => {
            getLLMAnswers(result, sockets);
        }, 0);

        console.log("this is the added postQuestion:");
        console.log(result);
        return result;

The setTimout allows for executing the getLLMAnswers after the result has been return using http. The llm answers are then later sent to the users through websockets
- If the user has sent an answer or question in the last minute, a warning notification is shown to the user: "Only one post per minute!". The last submission time stamp is stored server side in a very simple cache map 'postTimes' where user_uuid is the key: 
const postTimes = new Map(); 
- To use infinite scrolling, the database fetching for questions and answers is configured so that an offset, acquired from the frontend, is taken into account when fetching results.




## Possible improvements
I configured the Kubernetes, but couldn't get the pod-pod communications to work so I finally decided to leave it out.
1. Ge the communications inside kubernetes to work
2. Implement auto load balancing with kubernetes
3. Deploy grafana