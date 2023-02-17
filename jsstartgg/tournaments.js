import {
    sendQuery
} from "./api.js"
import * as filters from "./filters.js"
import * as q from './t_queries.js';

// HELPER FUNCTIONS

// Helper function to get playerId at an event
export function get_player_id(event_id, player_name, header, auto_retry) {
    const variables = {
        "eventId": event_id,
        "name": player_name
    };
    const data = sendQuery(q.PLAYER_ID_QUERY, variables, header, auto_retry).then(filters.player_id_filter(response, player_name));
    console.log(data);
    return data;
}
// Helper function to get entrantId at an event
export function get_entrant_id(event_id, player_name, header, auto_retry) {
    const variables = {
        "eventId": event_id,
        "name": player_name
    };
    const data = sendQuery(q.ENTRANT_ID_QUERY, variables, header, auto_retry).then(response.event.entrants.nodes[0].id);
    console.log(data);
    return data;
}
// Helper function to get an eventId from a tournament
export function get_event_id(tournament_name, event_name, header, auto_retry) {
    const variables = {
        "tourneySlug": tournament_name
    };
    const data = sendQuery(q.EVENT_ID_QUERY, variables, header, auto_retry).then(filters.event_id_filter(response, event_name));
    console.log(data);
    return data;
}
// ACTUAL FUNCTIONS

// Metadata for a tournament
export function show(tournament_name, header, auto_retry) {
    const variables = {
        "tourneySlug": tournament_name
    };
    const data = sendQuery(q.SHOW_QUERY, variables, header, auto_retry).then(filters.show_filter(response));
    console.log(data);
    return data;
}
// Metadata for a tournament with a specific brackets
export function show_with_brackets(tournament_name, event_name, header, auto_retry) {
    const variables = {
        "tourneySlug": tournament_name
    };
    const data = sendQuery(q.SHOW_WITH_BRACKETS_QUERY, variables, header, auto_retry).then(filters.show_with_brackets_filter(response, event_name));
    console.log(data);
    return data;
}
// Metadata for a tournament with all brackets
export function show_with_brackets_all(tournament_name, header, auto_retry) {
    const variables = {
        "tourneySlug": tournament_name
    };
    const data = sendQuery(q.SHOW_WITH_BRACKETS_QUERY, variables, header, auto_retry).then(filters.show_with_brackets_all_filter(response));
    console.log(data);
    return data;
}
// Shows all events from a tournaments
export function show_events(tournament_name, header, auto_retry) {
    const variables = {
        "tourneySlug": tournament_name
    };
    const data = sendQuery(q.SHOW_EVENTS_QUERY, variables, header, auto_retry).then(filters.show_events_filter(response));
    console.log(data);
    return data;
}
// Shows all the sets from an event 
export function show_sets(tournament_name, event_name, page_num, header, auto_retry) {
    const event_id = get_event_id(tournament_name, event_name, header, auto_retry)
    const variables = {
        "eventId": event_id,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_SETS_QUERY, variables, header, auto_retry).then(filters.show_sets_filter(response));
    console.log(data);
    return data;
}
// Shows all entrants from a specific event
export function show_entrants(tournament_name, event_name, page_num, header, auto_retry) {
    const event_id = get_event_id(tournament_name, event_name, header, auto_retry)
    const variables = {
        "eventId": event_id,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_ENTRANTS_QUERY, variables, header, auto_retry).then(filters.show_entrants_filter(response));
    console.log(data);
    return data;
}
// Shows all the event bracket IDs as well as the name and slug of the event
export function show_event_brackets(tournament_name, event_name, header, auto_retry) {
    const variables = {
        "tourneySlug": tournament_name
    };
    const data = sendQuery(q.SHOW_EVENT_BRACKETS_QUERY, variables, header, auto_retry).then(filters.show_events_brackets_filter(response, event_name));
    console.log(data);
    return data;
}
// Same as show_events_brackets but for all events at a tournament
export function show_all_event_brackets(tournament_name, header, auto_retry) {
    const variables = {
        "tourneySlug": tournament_name
    };
    const data = sendQuery(q.SHOW_EVENT_BRACKETS_QUERY, variables, header, auto_retry).then(filters.show_all_event_brackets_filter(response));
    console.log(data);
    return data;
}
// Shows all entrant sets from a given event
export function show_entrant_sets(tournament_name, event_name, entrant_name, header, auto_retry) {
    const event_id = get_event_id(tournament_name, event_name, header, auto_retry)
    const entrant_id = get_entrant_id(event_id, entrant_name, header, auto_retry)
    const variables = {
        "eventId": event_id,
        "entrantId": entrant_id,
        "page": 1
    };
    const data = sendQuery(q.SHOW_ENTRANT_SETS_QUERY, variables, header, auto_retry).then(filters.show_entrant_sets_filter(response));
    console.log(data);
    return data;
}
// Shows head to head at an event for two given entrants
export function show_head_to_head(tournament_name, event_name, entrant1_name, entrant2_name, header, auto_retry) {
    const event_id = get_event_id(tournament_name, event_name, header, auto_retry)
    const entrant1_id = get_entrant_id(event_id, entrant1_name, header, auto_retry)
    const variables = {
        "eventId": event_id,
        "entrantId": entrant1_id,
        "page": 1
    };
    const data = sendQuery(q.SHOW_ENTRANT_SETS_QUERY, variables, header, auto_retry).then(filters.show_head_to_head_filter(response, entrant2_name));
    console.log(data);
    return data;
}
// Shows all events (of a certain game) of a minimum size in between two unix timestamps
export function show_event_by_game_size_dated(num_entrants, videogame_id, after, before, page_num, header, auto_retry) {
    const variables = {
        "videogameId": videogame_id,
        "after": after,
        "before": before,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_EVENT_BY_GAME_SIZE_DATED_QUERY, variables, header, auto_retry).then(filters.show_event_by_game_size_dated_filter(response, num_entrants, videogame_id));
    console.log(data);
    return data;
}
// Shows the results of an event with only entrant name, id, and placement
export function show_lightweight_results(tournament_name, event_name, page_num, header, auto_retry) {
    const event_id = get_event_id(tournament_name, event_name, header, auto_retry)
    const variables = {
        "eventId": event_id,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_LIGHTWEIGHT_RESULTS_QUERY, variables, header, auto_retry).then(filters.show_lightweight_results_filter(response));
    console.log(data);
    return data;
}
// Shows a list of tournaments by country
export function show_by_country(country_code, page_num, header, auto_retry) {
    const variables = {
        "countryCode": country_code,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_BY_COUNTRY_QUERY, variables, header, auto_retry).then(filters.show_by_country_filter(response));
    console.log(data);
    return data;
}
// Shows a list of tournaments by US State
export function show_by_state(state_code, page_num, header, auto_retry) {
    const variables = {
        "state": state_code,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_BY_STATE_QUERY, variables, header, auto_retry).then(filters.show_by_state_filter(response));
    console.log(data);
    return data;
}
// Shows a list of tournaments from a certain point within a radius
export function show_by_radius(coordinates, radius, page_num, header, auto_retry) {
    const variables = {
        "coordinates": coordinates,
        "radius": radius,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_BY_RADIUS_QUERY, variables, header, auto_retry).then(filters.show_by_radius_filter(response));
    console.log(data);
    return data;
}
// Shows a list of players at a tournament by their sponsor
export function show_players_by_sponsor(tournament_name, sponsor, header, auto_retry) {
    const variables = {
        "slug": tournament_name,
        "sponsor": sponsor
    };
    const data = sendQuery(q.SHOW_PLAYERS_BY_SPONSOR, variables, header, auto_retry).then(filters.show_players_by_sponsor_filter(response));
    console.log(data);
    return data;
}
export function show_by_owner(owner, page_num, header, auto_retry) {
    const variables = {
        "ownerId": owner,
        "page": page_num
    };
    const data = sendQuery(q.SHOW_BY_OWNER_QUERY, variables, header, auto_retry).then(filters.show_by_owner_filter(response));
    console.log(data);
    return data;
}