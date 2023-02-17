import {
    GraphQLClient
} from "graphql-request";

export function fetch_error_code(err) {
    if (err.response.status) {
        const num = err.response.status;
        console.error(num, err.response.message);
        if (num === 400) {
            console.error("This most likely means that your key is wrong or invalid, check that you have it set to the env key 'KEY'.");
            process.exit(num);
        } else if (num === 429) {
            console.error("This means you are send too many requests to fast, make sure you space out your request to a least as slow as 1 a second. This could also mean there is an infinite loop.")
            process.exit(num);
        } else if (400 <= num <= 500) {
            console.error("This means there is an unknown request error. Check your queries if using a custom query and possibly google the error code.")
            process.exit(num);
        } else if (500 <= num < 600) {
            console.error("This means there is an unknown server error. This is on startgg's side so just try again. If the issue persists google the error code.")
            process.exit(num);
        } else {
            console.error("If the above message is not helpful check out this wiki page: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes")
            process.exit(num);
        }
    } else {
        console.error(err)
        process.exit(1)
    }
}

//  Runs queries
export async function sendQuery(query, variables, header, auto_retry = true, tries = 0) {
    try {
        const graphQLClient = new GraphQLClient('https://api.start.gg/gql/alpha', header);
        if (auto_retry === true && tries < 6) {
            const data = await graphQLClient.request(query, variables).catch((err) => err.response.status === 429 || 500 <= err.response.status < 600 ? fetch_error_code(err) : setTimeout(() => {
                sendQuery(query, variables, header, auto_retry, tries + 1)
            }, 10000))
            return data;
        } else {
            const data = await graphQLClient.request(query, variables).catch((err) => process.exit(err.response.status));
            return data;
        }
    } catch (err) {
        fetch_error_code(err)
    }
}