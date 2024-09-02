import { questionsStore } from "../stores/stores.js";
const questionStore = questionsStore();

const getQuestions = async (id, offset) => {
    const response = await fetch(`/qa-api/questions/${id}?` + new URLSearchParams({ offset: offset }).toString());
    const question_list = await response.json();

    if (offset === 0) {
        questionStore.set(question_list);
    }
    else {
        questionStore.add(question_list);
    }
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

    const response = await fetch(`/qa-api/questions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();
    return res;
}

const upvoteQuestion = async (question, userUuid) => {

    console.log(userUuid);

    const data = {
        question_id: question.id,
        user_uuid: userUuid
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
    if (res !== "upvote exists") {
        questionStore.upvote(question.id);
        questionStore.sort();
    }
}

export { getQuestion, getQuestions, sendQuestion, upvoteQuestion }