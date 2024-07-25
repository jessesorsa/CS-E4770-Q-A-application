import * as courseService from "../services/courseService.js";
import * as questionService from "../services/questionService.js";
import * as answerService from "../services/answerService.js";

const getCourses = async (request, mappingResult) => {
    const result = await courseService.fetchAllCourses();
    return result;
};

const getCourse = async (request, mappingResult) => {
    const course_id = mappingResult.pathname.groups.id;
    const result = await courseService.fetchCourse(course_id);
    return result;
};



const getQuestions = async (request, mappingResult) => {
    const course_id = mappingResult.pathname.groups.id;
    console.log("Getting questions");
    const result = await questionService.fetchAllQuestions(course_id);
    console.log(result);
    return result;
};

const getQuestion = async (request, mappingResult) => {
    const question_id = mappingResult.pathname.groups.id;
    const result = await questionService.fetchQuestion(question_id);
    return result;

};

const postQuestion = async (request, mappingResult) => {
    const data = await request.json();
    const result = await questionService.postQuestion(data.course_id, data.user_uuid, data.question);
    console.log("this is the added postQuestion:");
    console.log(result);
    return result;
};

const upvoteQuestion = async (request, mappingResult) => {
    const data = await request.json();
    const result = await questionService.upvoteQuestion(data.question_id);
    return result;
};


const getAnswers = async (request, mappingResult) => {
    const question_id = mappingResult.pathname.groups.id;
    const result = await answerService.fetchAllAnswers(question_id);
    return result;
};

const postAnswer = async (request, mappingResult) => {
    const data = await request.json();
    const result = await answerService.postAnswer(data.question_id, data.user_uuid, data.answer, false);
    return result;
};

const upvoteAnswer = async (request, mappingResult) => {
    const data = await request.json();
    const result = await answerService.upvoteAnswer(data.answer_id);
    return result;
};


export {
    getCourses, getCourse, postQuestion,
    getQuestions, getQuestion, upvoteQuestion, getAnswers,
    postAnswer, upvoteAnswer
}