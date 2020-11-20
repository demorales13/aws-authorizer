async function getAll(event, context) {

    let data = [
        "data 1",
        "data 2"
    ];

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};

export const handler = getAll; // commonMiddleware(getAll);