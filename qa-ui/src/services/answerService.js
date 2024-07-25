import { answersStore } from "../stores/stores.js";
const answerStore = answersStore();

const getAnswers = async (id) => {
    const response = await fetch(`/qa-api/answers/${id}`);
    const answers_list = await response.json();
    answerStore.set(answers_list);
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

    const new_answer = await response.json();
    answerStore.add(new_answer);
    answerStore.sort();
}

const upvoteAnswer = async (answer) => {

    const data = {
        answer_id: answer.id
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
    answerStore.upvote(answer.id);
    answerStore.sort();
}

export { getAnswers, sendAnswer, upvoteAnswer }