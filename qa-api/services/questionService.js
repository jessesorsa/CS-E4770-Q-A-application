import { sql } from "../database/database.js";

const fetchAllQuestions = async (id) => {
  return await sql`SELECT * FROM questions WHERE course_id = ${id};`;
};

const fetchQuestion = async (id) => {
  return await sql`SELECT * FROM questions WHERE id = ${id};`;
};

const upvoteQuestion = async (id) => {
  return await sql`UPDATE questions SET 
  upvotes = upvotes + 1, 
  upvote_time = CURRENT_TIMESTAMP
  WHERE id = ${id};`
};

const postQuestion = async (course_id, user_uuid, question) => {
  await sql`INSERT INTO questions (course_id, user_uuid, question, upvotes, post_time, upvote_time)
  VALUES
  (${course_id}, ${user_uuid}, ${question}, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
  const result = await sql`SELECT * FROM questions WHERE course_id = ${course_id} AND user_uuid = ${user_uuid} AND question = ${question};`;
  return result[0];
};

export { fetchAllQuestions, postQuestion, fetchQuestion, upvoteQuestion }