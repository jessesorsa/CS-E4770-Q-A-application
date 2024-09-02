import { answersStore } from "../stores/stores.js";
const answerStore = answersStore();

const getAnswers = async (id, offset) => {
    const response = await fetch(`/qa-api/answers/${id}?` + new URLSearchParams({ offset: offset }).toString());
    const answers_list = await response.json();
    console.log(answers_list);
    if (offset === 0) {
        answerStore.set(answers_list);
    }
    else {
        answerStore.add(answers_list);
    }
    answerStore.sort();
}

const sendAnswer = async (question, userUuid, text) => {
    console.log("question id:");
    console.log(question.id);

    const data = {
        question_id: question.id,
        user_uuid: userUuid,
        answer: text
    };

    const response = await fetch(`/qa-api/answers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();
    return res;
}

const upvoteAnswer = async (answer, userUuid) => {

    const data = {
        answer_id: answer.id,
        user_uuid: userUuid
    };

    const response = await fetch(`/qa-api/answer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();
    console.log(res);
    if (res !== "upvote exists") {
        answerStore.upvote(answer.id);
        answerStore.sort();
    }
}

export { getAnswers, sendAnswer, upvoteAnswer }