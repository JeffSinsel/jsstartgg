import {
    sendQuery
} from "./api.js"
import * as filters from "./filters.js"
import * as q from './b_queries.js';

// Shows all the players in a bracket (aka phaseGroup)
export function show_entrants(bracket_id, page_num, header, auto_retry) {
    const variables = {
        "phaseGroupId": bracket_id,
        "page": page_num
    }
    const data = sendQuery(q.BRACKET_SHOW_ENTRANTS_QUERY, variables, header, auto_retry).then(response => filters.bracket_show_entrants_filter(response))
    console.log(data);
    return data;
}
// Shows all the players in a bracket
export function show_sets(bracket_id, page_num, header, auto_retry) {
    const variables = {
        "phaseGroupId": bracket_id,
        "page": page_num
    }
    const data = sendQuery(q.BRACKET_SHOW_SETS_QUERY, variables, header, auto_retry).then(response => filters.bracket_show_sets_filter(response))
    console.log(data);
    return data;
}