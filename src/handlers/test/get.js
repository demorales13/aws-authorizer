async function get(event, context) {

    let data = "Ok";

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};

export const handler = get; //commonMiddleware(get);