import {
    sendQuery
} from "./api.js"
import * as filters from "./filters.js"
import * as q from './l_queries.js';

// Shows metadata for a league
export function show(league_name, header, auto_retry) {
    const variables = {
        "slug": league_name
    };
    const data = sendQuery(q.SHOW_QUERY, variables, header, auto_retry).then(response => filters.league_show_filter(response));
    console.log(data);
    return data;
}

// Shows schedule for a league
export function show_schedule(league_name, page_num, header, auto_retry) {
    const variables = {
        "slug": league_name,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_SCHEDULE_QUERY, variables, header, auto_retry).then(response => filters.league_show_schedule_filter(response));
    console.log(data);
    return data;
}

// Shows standings for a league
export function show_standings(league_name, page_num, header, auto_retry) {
    const variables = {
        "slug": league_name,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_STANDINGS_QUERY, variables, header, auto_retry).then(response => filters.league_show_standings_filter(response));
    console.log(data);
    return data;
}