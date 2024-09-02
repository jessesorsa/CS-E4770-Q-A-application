import * as courseService from "../services/courseService.js";
import * as questionService from "../services/questionService.js";
import * as answerService from "../services/answerService.js";
import * as llmService from "../services/llmService.js";

const postTimes = new Map();

const TIME_LIMIT = 60000;

const checkPostTime = (data) => {

    const current_time = Date.now();
    const post_time = postTimes.get(data.user_uuid);

    if ((current_time - post_time) < TIME_LIMIT) {
        return false;
    }
    else {
        postTimes.set(data.user_uuid, current_time);
        return true;
    }
};

const sendSocketMessage = async (message, sockets) => {
    console.log("message in socket:");
    console.log(JSON.stringify(message));

    sockets.forEach((socket) => {
        socket.send(JSON.stringify(message));
    });
};

const getLLMAnswers = async (question, sockets) => {

    for (let a = 0; a < 3; a++) {
        const prompt = `Give a very short and simple but insightful answer to this question: ${question.question}###`;
        const result = await llmService.llm(prompt);
        const res = await result.json();
        const answer = res[0].generated_text.split("###");
        console.log("LLM answer:");
        console.log(answer[1]);
        console.log("question", question);
        const message = await answerService.postAnswer(question.id, "opt-125m", answer[1], true);
        await sendSocketMessage(message, sockets);
    };
};

const getCourses = async (request, mappingResult) => {
    const result = await courseService.fetchAllCourses();
    return result;
};

const getCourse = async (request, mappingResult) => {
    console.log("Hello again");
    const course_id = mappingResult.pathname.groups.id;
    const result = await courseService.fetchCourse(course_id);
    return result;
};



const getQuestions = async (request, mappingResult) => {
    const url = new URL(request.url);
    const offset = url.searchParams.get("offset");
    const course_id = mappingResult.pathname.groups.id;
    const result = await questionService.fetchAllQuestions(course_id, offset);
    return result;
};

const getQuestion = async (request, mappingResult) => {
    const question_id = mappingResult.pathname.groups.id;
    const result = await questionService.fetchQuestion(question_id);
    return result;

};

const postQuestion = async (request, mappingResult, sockets) => {
    const data = await request.json();
    const timing_access = checkPostTime(data);

    if (timing_access === true) {
        const result = await questionService.postQuestion(data.course_id, data.user_uuid, data.question);

        setTimeout(() => {
            getLLMAnswers(result, sockets);
        }, 0);

        console.log("this is the added postQuestion:");
        console.log(result);
        return result;
    }
    else {
        console.log("wait");
        return "wait";
    }
};

const upvoteQuestion = async (request, mappingResult) => {
    const data = await request.json();
    console.log(data);
    const previous_upvote = await questionService.fetchUpvoteQuestionUserUuid(data.question_id, data.user_uuid);
    let result;
    console.log(previous_upvote[0]);
    if (previous_upvote[0]) {
        result = "upvote exists";
    }
    else {
        result = await questionService.upvoteQuestion(data.question_id);
        await questionService.upvoteQuestionUserUuid(data.question_id, data.user_uuid);
    }
    return result;
};


const getAnswers = async (request, mappingResult) => {
    const url = new URL(request.url);
    const offset = url.searchParams.get("offset");
    const question_id = mappingResult.pathname.groups.id;
    const result = await answerService.fetchAllAnswers(question_id, offset);
    return result;
};

const postAnswer = async (request, mappingResult) => {
    const data = await request.json();

    const timing_access = checkPostTime(data);

    if (timing_access === true) {
        const result = await answerService.postAnswer(data.question_id, data.user_uuid, data.answer, false);
        return result;
    }
    else {
        console.log("wait");
        return "wait";
    }
};

const upvoteAnswer = async (request, mappingResult) => {
    const data = await request.json();
    const previous_upvote = await answerService.fetchUpvoteAnswerUserUuid(data.answer_id, data.user_uuid);
    let result;
    console.log(previous_upvote);
    if (previous_upvote[0]) {
        result = "upvote exists";
    }
    else {
        result = await answerService.upvoteAnswer(data.answer_id);
        await answerService.upvoteAnswerUserUuid(data.answer_id, data.user_uuid);
    }
    console.log(result);
    return result;
}


export {
    getCourses, getCourse, postQuestion,
    getQuestions, getQuestion, upvoteQuestion, getAnswers,
    postAnswer, upvoteAnswer
}