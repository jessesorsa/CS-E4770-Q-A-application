import { sql } from "../database/database.js";

const fetchAllAnswers = async (id) => {
  return await sql`SELECT * FROM answers WHERE question_id = ${id};`;
};

const fetchAnswer = async (user_uuid, post_time) => {
  return await sql`SELECT * FROM answers WHERE user_uuid = ${user_uuid} AND post_time = ${post_time};`;
};

const upvoteAnswer = async (id) => {
  return await sql`UPDATE answers SET 
  upvotes = upvotes + 1, 
  upvote_time = CURRENT_TIMESTAMP
  WHERE id = ${id};`;
};

const postAnswer = async (question_id, user_uuid, answer, ai_generated) => {
  await sql`INSERT INTO answers (question_id, user_uuid, answer, upvotes, post_time, upvote_time, ai_generated)
  VALUES
  (${question_id}, ${user_uuid}, ${answer}, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${ai_generated});`;
  const result = await sql`SELECT * FROM answers WHERE question_id = ${question_id} AND user_uuid = ${user_uuid} AND answer = ${answer};`;
  return result[0];
};

export { fetchAllAnswers, fetchAnswer, upvoteAnswer, postAnswer }