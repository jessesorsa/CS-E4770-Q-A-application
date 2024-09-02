import http from "k6/http";

export const options = {
    duration: "10s",
    vus: 10,
    summaryTrendStats: ["med", "p(99)"]
};

export default function () {

    const questionId = 74;
    const userUuid = 'k6_test';
    const text = "This is an answer.";

    const data = {
        question_id: questionId,
        user_uuid: userUuid,
        answer: text
    };

    http.post(`http://localhost:7800/answers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

};
