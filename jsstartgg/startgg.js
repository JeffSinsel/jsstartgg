import * as tournaments from './tournaments.js';
import * as brackets from './brackets.js';
import * as players from './players.js';
import * as events from './events.js';
import * as leagues from './leagues.js'

export class StartGG {
    constructor(key, auto_retry = true) {
        this.key = String(key);
        this.header = {
            headers: {
                authorization: `Bearer ${key}`
            }
        };
        this.auto_retry = auto_retry;
    }
    set_key_and_header(new_key) {
        this.key = new_key;
        this.header = {
            headers: {
                authorization: `Bearer ${key}`
            }
        };
    }
    // Sets automatic retry, a variable that says if sendQuery retries if too many requests
    set_auto_retry(boo) {
        this.auto_retry = boo
    }
    print_key() {
        console.log(this.key);
    }
    print_header() {
        console.log(this.header);
    }
    print_auto_retry() {
        console.log(this.auto_retry);
    }
    // Event_id for a tournament
    tournament_show_event_id(tournament_name, event_name) {
        return tournaments.get_event_id(tournament_name, event_name, this.header, this.auto_retry);
    }
    // Metadata for a tournament
    tournament_show(tournament_name) {
        return tournaments.show(tournament_name, this.header, this.auto_retry)
    }
    // Metadata for a tournament with a bracket
    tournament_show_with_brackets(tournament_name, event_name) {
        return tournaments.show_with_brackets(tournament_name, event_name, this.header, this.auto_retry)
    }
    // Same as tournament_show_with_brackets but for all brackets
    tournament_show_with_brackets_all(tournament_name) {
        return tournaments.show_with_brackets_all(tournament_name, this.header, this.auto_retry)
    }
    // List of events for a tournament
    tournament_show_events(tournament_name) {
        return tournaments.show_events(tournament_name, this.header, this.auto_retry)
    }
    // List of sets for an event
    tournament_show_sets(tournament_name, event_name, page_num) {
        return tournaments.show_sets(tournament_name, event_name, page_num, this.header, this.auto_retry)
    }
    // List of entrants for an event
    tournament_show_entrants(tournament_name, event_name, page_num) {
        return tournaments.show_entrants(tournament_name, event_name, page_num, this.header, this.auto_retry)
    }
    // Bracket info for an event at a tournament
    tournament_show_event_brackets(tournament_name, event_name) {
        return tournaments.show_event_brackets(tournament_name, event_name, this.header, this.auto_retry)
    }
    // Bracket info for all events at a tournament
    tournament_show_all_event_brackets(tournament_name) {
        return tournaments.show_all_event_brackets(tournament_name, this.header, this.auto_retry)
    }
    // All sets from an entrant at an event
    tournament_show_entrant_sets(tournament_name, event_name, entrant_name) {
        return tournaments.show_entrant_sets(tournament_name, event_name, entrant_name, this.header, this.auto_retry)
    }
    // All sets between two entrants at an event
    tournament_show_head_to_head(tournament_name, event_name, entrant1_name, entrant2_name) {
        return tournaments.show_head_to_head(tournament_name, event_name, entrant1_name, entrant2_name, this.header, this.auto_retry)
    }
    // All tournaments with events (of a certain game) of a minimum size in between two unix timestamps
    tournament_show_event_by_game_size_dated(num_entrants, videogame_id, after, before, page_num) {
        return tournaments.show_event_by_game_size_dated(num_entrants, videogame_id, after, before, page_num, this.header, this.auto_retry)
    }
    // Results of an event with only entrant name, id, and placement
    tournament_show_lightweight_results(tournament_name, event_name, page_num) {
        return tournaments.show_lightweight_results(tournament_name, event_name, page_num, this.header, this.auto_retry)
    }
    // All tournaments by country (at least, as many at the API can display)
    tournament_show_by_country(country_code, page_num) {
        return tournaments.show_by_country(country_code, page_num, this.header, this.auto_retry)
    }
    // All tournaments by US State
    tournament_show_by_state(state_code, page_num) {
        return tournaments.show_by_state(state_code, page_num, this.header, this.auto_retry)
    }
    // All tournaments in a radius of a certain coordinate point
    tournament_show_by_radius(coordinates, radius, page_num) {
        return tournaments.show_by_radius(coordinates, radius, page_num, this.header, this.auto_retry)
    }
    // Players from a tournament with a certain sponsor
    tournament_show_players_by_sponsor(tournament_name, sponsor) {
        return tournaments.show_players_by_sponsor(tournament_name, sponsor, this.header, this.auto_retry)
    }
    // Tournaments by owner id
    tournament_show_by_owner(owner, page_num) {
        return tournaments.show_by_owner(owner, page_num, this.header, this.auto_retry)
    }
    // All entrants in a bracket (phaseGroup) at a tournament
    bracket_show_entrants(bracket_id, page_num) {
        return brackets.show_entrants(bracket_id, page_num, this.header, this.auto_retry)
    }
    // All sets in a bracket (phaseGroup) at a tournament
    bracket_show_sets(bracket_id, page_num) {
        return brackets.show_sets(bracket_id, page_num, this.header, this.auto_retry)
    }
    // Player metadata
    player_show_info(player_id) {
        return players.show_info(player_id, this.header, this.auto_retry)
    }
    // All tournaments by a player (where they registered with their smash.gg account)
    player_show_tournaments(player_id, page_num) {
        return players.show_tournaments(player_id, page_num, this.header, this.auto_retry)
    }
    // All tournaments by a player for a certain game
    // Use https://docs.google.com/spreadsheets/d/1l-mcho90yDq4TWD-Y9A22oqFXGo8-gBDJP0eTmRpTaQ/
    // to find the game_id you're looking for
    player_show_tournaments_for_game(player_id, player_name, videogame_id, page_num) {
        return players.show_tournaments_for_game(player_id, player_name, videogame_id, page_num, this.header, this.auto_retry)
    }
    // List of sets for an event
    event_show_sets(event_id, page_num) {
        return events.show_sets(event_id, page_num, this.header, this.auto_retry)
    }
    // List of entrants for an event
    event_show_entrants(event_id, page_num) {
        return events.show_entrants(event_id, page_num, this.header, this.auto_retry)
    }
    // All sets from an entrant at an event
    event_show_entrant_sets(event_id, entrant_name) {
        return events.show_entrant_sets(event_id, entrant_name, this.header, this.auto_retry)
    }
    // All sets between two entrants at an event
    event_show_head_to_head(event_id, entrant1_name, entrant2_name) {
        return events.show_head_to_head(event_id, entrant1_name, entrant2_name, this.header, this.auto_retry)
    }
    // Results of an event with only entrant name, id, and placement
    event_show_lightweight_results(event_id, page_num) {
        return events.show_lightweight_results(event_id, page_num, this.header, this.auto_retry)
    }
    // Metadata for a league
    league_show(league_name) {
        return leagues.show(league_name, this.header, this.auto_retry)
    }
    // League schedule (with events mainly, events at each tournament)
    league_show_schedule(league_name, page_num) {
        return leagues.show_schedule(league_name, page_num, this.header, this.auto_retry)
    }
    // League standings
    league_show_standings(league_name, page_num) {
        return leagues.show_standings(league_name, page_num, this.header, this.auto_retry)
    }
}