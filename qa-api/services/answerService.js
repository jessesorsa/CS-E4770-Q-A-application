import { sql } from "../database/database.js";

const fetchAllAnswers = async (id, offset) => {
  return await sql`
    SELECT * FROM answers
    WHERE question_id = ${id}
    ORDER BY upvote_time DESC
    LIMIT 20 OFFSET ${offset};`;
};

const upvoteAnswer = async (id) => {
  return await sql`UPDATE answers SET 
  upvotes = upvotes + 1, 
  upvote_time = CURRENT_TIMESTAMP
  WHERE id = ${id};`;
};

const upvoteAnswerUserUuid = async (answer_id, user_uuid) => {
  await sql`INSERT INTO answer_likes (answer_id, user_uuid) VALUES (${answer_id}, ${user_uuid});`;
};

const fetchUpvoteAnswerUserUuid = async (answer_id, user_uuid) => {
  return await sql`SELECT * FROM answer_likes 
  WHERE answer_id = ${answer_id} AND user_uuid = ${user_uuid};`;
};

const postAnswer = async (question_id, user_uuid, answer, ai_generated) => {
  await sql`INSERT INTO answers (question_id, user_uuid, answer, upvotes, post_time, upvote_time, ai_generated)
  VALUES
  (${question_id}, ${user_uuid}, ${answer}, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${ai_generated});`;
  const result = await sql`SELECT * FROM answers WHERE question_id = ${question_id} AND user_uuid = ${user_uuid} AND answer = ${answer};`;
  return result[0];
};

export {
  fetchAllAnswers, upvoteAnswer, postAnswer,
  upvoteAnswerUserUuid, fetchUpvoteAnswerUserUuid
}