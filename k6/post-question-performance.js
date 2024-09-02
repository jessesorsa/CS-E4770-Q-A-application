import http from "k6/http";

export const options = {
    duration: "10s",
    vus: 10,
    summaryTrendStats: ["med", "p(99)"]
};

export default function () {

    const courseId = 1;
    const userUuid = 'k6_test';
    const text = "Can you explain machine learning!";

    const data = {
        course_id: courseId,
        user_uuid: userUuid,
        question: text
    };

    http.post(`http://localhost:7800/questions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

};
