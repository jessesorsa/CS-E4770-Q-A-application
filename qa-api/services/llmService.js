const llm = async (prompt) => {

    const data = { "question": prompt }
    const response = await fetch(`http://llm-api:7000`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return response;
};

export { llm }