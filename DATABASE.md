## Database schema
The postgresql database has 5 different tables:
- courses
- questions
- answers
- question_likes
- answer_likes

When fetching data from courses, questions and answers, only the id SERIAL PRIMARY KEY is used, which is why no Indexes are created

For question_likes and answer_likes the following indexes are created: 

CREATE INDEX al_answer_id_user_uuid_idx ON
answer_likes (answer_id, user_uuid);

CREATE INDEX ql_question_id_user_uuid_idx ON
answer_likes (answer_id, user_uuid);


## Caching decisions
Redis server is used for caching functionality.
The redis server is accessed on the server side.
All requests are cached and the cache is flushed when the following actions are taken ["postQuestion", "upvoteQuestion", "postAnswer", "upvoteAnswer"]. So when the backend data is modified, the cache is flushed. This ensures that up-to-date info is visible, but unnecessary database fetching is avoided if data doesn't change.
