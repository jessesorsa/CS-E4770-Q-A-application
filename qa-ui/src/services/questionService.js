import { questionsStore } from "../stores/stores.js";
const questionStore = questionsStore();

const getQuestions = async (id) => {
    const response = await fetch(`/qa-api/questions/${id}`);
    const question_list = await response.json();
    questionStore.set(question_list);
    questionStore.sort();
}

const getQuestion = async (id) => {
    const response = await fetch(`/qa-api/question/${id}`);
    return await response.json();
}

const sendQuestion = async (course, userUuid, text) => {
    console.log("course id:");
    console.log(course.id);

    const data = {
        course_id: course.id,
        user_uuid: userUuid,
        question: text
    };

    await fetch(`/qa-api/questions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

const upvoteQuestion = async (question) => {

    const data = {
        question_id: question.id
    };

    const response = await fetch(`/qa-api/question`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();
    console.log(res);
    questionStore.upvote(question.id);
    questionStore.sort();
}

export { getQuestion, getQuestions, sendQuestion, upvoteQuestion }