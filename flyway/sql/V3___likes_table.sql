CREATE TABLE question_likes (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  user_uuid TEXT NOT NULL
);

CREATE TABLE answer_likes (
    id SERIAL PRIMARY KEY,
    answer_id INTEGER REFERENCES answers(id),
    user_uuid TEXT NOT NULL
);

CREATE INDEX al_answer_id_user_uuid_idx ON
answer_likes (answer_id, user_uuid);

CREATE INDEX ql_question_id_user_uuid_idx ON
answer_likes (answer_id, user_uuid);