import {
    sendQuery
} from "./api.js"
import * as filters from "./filters.js"
import * as q from './e_queries.js';

// Helper function to get entrantId at an event
export function get_entrant_id(event_id, player_name, header, auto_retry) {
    const variables = {
        "eventId": event_id,
        "name": player_name
    }
    const data = sendQuery(q.ENTRANT_ID_QUERY, variables, header, auto_retry).then(response => response.event.entrants.nodes[0].id);
    console.log(data);
    return data;
}

// Shows all the sets from an event 
export function show_sets(event_id, page_num, header, auto_retry) {
    const variables = {
        "eventId": event_id,
        "page": page_num
    }
    const data = sendQuery(q.SHOW_SETS_QUERY, variables, header, auto_retry).then(response => filters.show_sets_filter(response));
    console.log(data);
    return data;
}

// Shows all entrants from a specific event 
export function show_entrants(event_id, page_num, header, auto_retry) {
    const variables = {
        "eventId": event_id,
        "page": page_num
    }
    const data = sendQuery(q.SHOW_ENTRANTS_QUERY, variables, header, auto_retry).then(response => filters.show_entrants_filter(response));
    console.log(data);
    return data;
}

// Shows all entrant sets from a given event
export function show_entrant_sets(event_id, entrant_name, header, auto_retry) {
    const entrant_id = get_entrant_id(event_id, entrant_name, header, auto_retry)
    const variables = {
        "eventId": event_id,
        "entrantId": entrant_id,
        "page": 1
    }
    const data = sendQuery(q.SHOW_ENTRANT_SETS_QUERY, variables, header, auto_retry).then(response => filters.show_entrant_sets_filter(response));
    console.log(data);
    return data;
}

// Shows head to head at an event for two given entrants
export function show_head_to_head(event_id, entrant1_name, entrant2_name, header, auto_retry) {
    const entrant1_id = get_entrant_id(event_id, entrant1_name, header, auto_retry)
    const variables = {
        "eventId": event_id,
        "entrantId": entrant1_id,
        "page": 1
    }
    const data = sendQuery(q.SHOW_ENTRANT_SETS_QUERY, variables, header, auto_retry).then(response => filters.show_head_to_head_filter(response, entrant2_name));
    console.log(data);
    return data;
}

// Shows the results of an event with only entrant name, id, and placement
export function show_lightweight_results(event_id, page_num, header, auto_retry) {
    const variables = {
        "eventId": event_id,
        "page": page_num
    }
    const data = sendQuery(q.SHOW_LIGHTWEIGHT_RESULTS_QUERY, variables, header, auto_retry).then(response => filters.show_lightweight_results_filter(response));
    console.log(data);
    return data;
}