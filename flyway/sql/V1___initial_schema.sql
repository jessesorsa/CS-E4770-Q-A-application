CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  course_name TEXT NOT NULL
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id),
  user_uuid TEXT NOT NULL,
  question TEXT NOT NULL,
  upvotes INTEGER NOT NULL,
  post_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  upvote_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  user_uuid TEXT NOT NULL,
  answer TEXT NOT NULL,
  upvotes INTEGER NOT NULL,
  post_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  upvote_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_generated BOOLEAN DEFAULT FALSE
);
