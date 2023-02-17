import {
    sendQuery
} from "./api.js"
import * as filters from "./filters.js"

// Shows info for a player
export function show_info(player_id, header, auto_retry) {
    const variables = {
        "playerId": player_id
    };
    const data = sendQuery(PLAYER_SHOW_INFO_QUERY, variables, header, auto_retry).then(response => filters.player_show_info_filter(response));
    console.log(data);
    return data;
}
// Shows tournament attended by a player
export function show_tournaments(player_id, page_num, header, auto_retry) {
    const variables = {
        "playerId": player_id,
        "page": page_num
    };
    const data = sendQuery(PLAYER_SHOW_TOURNAMENTS_QUERY, variables, header, auto_retry).then(response => filters.player_show_tournaments_filter(response));
    console.log(data);
    return data;
}
// Shows tournaments attended by a player for a certain game
// This is SUPER janky code but I don't know how to get it to work otherwise 
export function show_tournaments_for_game(player_id, player_name, videogame_id, page_num, header, auto_retry) {
    const variables = {
        "playerId": player_id,
        "playerName": player_name,
        "videogameId": videogame_id,
        "page": page_num
    };
    const data = sendQuery(PLAYER_SHOW_TOURNAMENTS_FOR_GAME_QUERY, variables, header, auto_retry).then(response => filters.player_show_tournaments_for_game(response, videogame_id));
    console.log(data);
    return data;
}