// TOURNAMENTS.PY AND EVENTS.PY

// Filtering for the player_id function
export function player_id_filter(response, player_name) {
  var player_id = null;
  if (response.event.entrants.nodes === null) {
    return player_id;
  }

  for (var node of response.event.entrants.nodes[0].participants) {
    if (node.gamerTag.toLowerCase() === player_name.toLowerCase()) {
      player_id = node.player.id;
    } else if ((node.participants[0].gamerTag.split("|")[-1]).toLowerCase() === player_name.toLowerCase()) {
      player_id = node.player.id;
    }
  }

  return player_id;
}

// Filter for the event_id function
export function event_id_filter(response, event_name) {
  if (response.tournament === null) {
    return;
  }

  for (var event of response.tournament.events) {
    if (event.slug.split("/").pop() === event_name) {
      return event.id;
    }
  }

  return;
}

// Filtering for the show function
export function show_filter(response) {
  if (response.tournament === null) {
    return;
  }

  const data = {};

  data.id = response.tournament.id;
  data.name = response.tournament.name;
  data.country = response.tournament.countryCode;
  data.state = response.tournament.addrState;
  data.city = response.tournament.city;
  data.startTimestamp = response.tournament.startAt;
  data.endTimestamp = response.tournament.endAt;
  data.entrants = response.tournament.numAttendees;

  return data;
}

// Filtering for the show_with_brackets_all function
export function show_with_brackets_filter(response, event_name) {
  if (response.tournament == null) {
    return null;
  }

  var data = {};

  data.id = response.tournament.id;
  data.name = response.tournament.name;
  data.country = response.tournament.countryCode;
  data.state = response.tournament.addrState;
  data.city = response.tournament.city;
  data.startTimestamp = response.tournament.startAt;
  data.endTimestamp = response.tournament.endAt;
  data.entrants = response.tournament.numAttendees;

  for (var i = 0; i < response.tournament.events.length; i++) {
    var event = response.tournament.events[i];
    if (event.slug.split("/")[-1] == event_name) {
      data.eventId = event.id;
      data.eventName = event.name;
      data.eventSlug = event.slug.split('/')[-1];
      var bracket_ids = [];
      if (event.phaseGroups != null) {
        for (var j = 0; j < event.phaseGroups.length; j++) {
          var node = event.phaseGroups[j];
          bracket_ids.push(node.id);
        }
      }
      data.bracketIds = bracket_ids;

      break;
    }
  }
  return data;
}

// Filter for the show_events function
export function show_events_filter(response) {
  if (response.tournament === null) {
    return;
  }

  var event_list = [];
  for (var event of response.tournament.events) {
    var cur_event = {};
    cur_event.id = event.id;
    cur_event.name = event.name;
    cur_event.slug = event.slug.split('/').pop();
    cur_event.entrants = event.numEntrants;

    event_list.push(cur_event);
  }

  return event_list;
}

// Filter for the show_sets function
export function show_sets_filter(response) {
  if (!('data' in response)) {
    return;
  }
  if (response.event == null) {
    return;
  }

  if (response.event.sets.nodes == null) {
    return;
  }

  const sets = [];

  for (const node of response.event.sets.nodes) {
    if (node.slots.length < 2) {
      continue;
    }
    if (node.slots[0].entrant == null || node.slots[1].entrant == null) {
      continue;
    }

    const cur_set = {};
    cur_set.id = node.id;
    cur_set.entrant1Id = node.slots[0].entrant.id;
    cur_set.entrant2Id = node.slots[1].entrant.id;
    cur_set.entrant1Name = node.slots[0].entrant.name;
    cur_set.entrant2Name = node.slots[1].entrant.name;

    if (node.games != null) {
      const entrant1_chars = [];
      const entrant2_chars = [];
      const game_winners_ids = [];
      for (const game of node.games) {
        if (game.selections == null) {
          continue;
        } else if (node.slots[0].entrant.id == game.selections[0].entrant.id) {
          entrant1_chars.push(game.selections[0].selectionValue);
          if (game.selections.length > 1) {
            entrant2_chars.push(game.selections[1].selectionValue);
          }
        } else {
          entrant2_chars.push(game.selections[0].selectionValue);
          if (game.selections.length > 1) {
            entrant1_chars.push(game.selections[1].selectionValue);
          }
        }

        game_winners_ids.push(game.winnerId);
      }

      cur_set.entrant1Chars = entrant1_chars;
      cur_set.entrant2Chars = entrant2_chars;
      cur_set.gameWinners = game_winners_ids;
    }

    var match_done = true;

    if (node.slots[0].standing == null) {
      cur_set.entrant1Score = -1;
      match_done = false;
    } else if (node.slots[0].standing.stats.score.value != null) {
      cur_set.entrant1Score = node.slots[0].standing.stats.score.value;
    } else {
      cur_set.entrant1Score = -1;
    }

    if (node.slots[1].standing == null) {
      cur_set.entrant2Score = -1;
      match_done = false;
    } else if (node.slots[1].standing.stats.score.value != null) {
      cur_set.entrant2Score = node.slots[1].standing.stats.score.value;
    } else {
      cur_set.entrant2Score = -1;
    }

    if (match_done) {
      cur_set.completed = true;
      if (node.slots[0].standing.placement == 1) {
        cur_set.winnerId = cur_set.entrant1Id;
        cur_set.loserId = cur_set.entrant2Id;
        cur_set.winnerName = cur_set.entrant1Name;
        cur_set.loserName = cur_set.entrant2Name;
      } else if (node.slots[0].standing.placement == 2) {
        cur_set.winnerId = cur_set.entrant2Id;
        cur_set.loserId = cur_set.entrant1Id;
        cur_set.winnerName = cur_set.entrant2Name;
      } else {
        cur_set.completed = False;
      }
      cur_set.fullRoundText = node.fullRoundText;
      if (node.phaseGroup) {
        cur_set.bracketName = node.phaseGroup.phase.name;
        cur_set.bracketId = node.phaseGroup.id;
      } else {
        cur_set.bracketName = null;
        cur_set.bracketId = null;
      }
      // This gives player_ids, but it also is made to work with team events
      for (var j = 0; j < 2; j++) {
        var players = [];
        for (var user of node.slots[j].entrant.participants) {
          var cur_player = {};
          if (user.player !== null) {
            cur_player.playerId = user.player.id;
            cur_player.playerTag = user.player.gamerTag;
            if (user.entrants !== null) {
              cur_player.entrantId = user.entrants[0].id;
            } else {
              cur_player.entrantId = node.slots[j].entrant.id;
            }
            players.push(cur_player);
          } else {
            cur_player.playerId = null;
            cur_player.playerTag = null;
            cur_player.entrantId = node.slots[j].entrant.id;
          }
        }
      }
      cur_set['entrant' + (j + 1) + 'Players'] = players;
    }

    sets.push(cur_set);
  }

  return sets;
}


// Filters for the show_players function
export function show_entrants_filter(response) {
  if (response.event === null) {
    return;
  }

  if (response.event.standings.nodes === null) {
    return;
  }

  var entrants = [];

  for (var node of response.event.standings.nodes) {
    var cur_entrant = {};
    cur_entrant.entrantId = node.entrant.id;
    cur_entrant.tag = node.entrant.name;
    cur_entrant.finalPlacement = node.placement;
    if (node.entrant.seeds === null) {
      cur_entrant.seed = -1;
    } else {
      cur_entrant.seed = node.entrant.seeds[0].seedNum;
    }

    var players = [];
    for (var user of node.entrant.participants) {
      var cur_player = {};
      if (user.player.id !== null) {
        cur_player.playerId = user.player.id;
      } else {
        cur_player.playerId = "None";
      }
      cur_player.playerTag = user.player.gamerTag;
      players.push(cur_player);
    }
    cur_entrant.entrantPlayers = players;

    entrants.push(cur_entrant);
  }

  return entrants;
}

// Filter for the show_events_brackets function
export function show_events_brackets_filter(response, event_name) {
  if (response.tournament == null) {
    return;
  }

  var brackets = {};

  for (var event of response.tournament.events) {
    if (event.slug.split('/').pop() == event_name) {
      var bracket_ids = [];
      for (var node of event.phaseGroups) {
        bracket_ids.push(node.id);
      }

      brackets.eventName = event.name;
      brackets.slug = event.slug;
      brackets.bracketIds = bracket_ids;
    }
  }

  return brackets;
}

// Filter for the show_all_event_brackets function
export function show_all_event_brackets_filter(response) {
  if (response.tournament === null) {
    return;
  }
  var brackets = [];
  for (var i = 0; i < response.tournament.events.length; i++) {
    var event = response.tournament.events[i];
    var cur_bracket = {};
    var bracket_ids = [];
    if (event.phaseGroups !== null) {
      for (var j = 0; j < event.phaseGroups.length; j++) {
        bracket_ids.push(event.phaseGroups[j].id);
      }
    }

    cur_bracket.eventName = event.name;
    cur_bracket.slug = event.slug;
    cur_bracket.bracketIds = bracket_ids;

    brackets.push(cur_bracket);
  }
  return brackets;
}

// Filter for the show_player_sets function
export function show_entrant_sets_filter(response) {
  if (response.event == null) {
    return;
  }

  if (response.event.sets.nodes == null) {
    return;
  }

  var sets = [];

  for (var node of response.event.sets.nodes) {
    var cur_set = {};
    cur_set.id = node.id;
    cur_set.entrant1Id = node.slots[0].entrant.id;
    cur_set.entrant2Id = node.slots[1].entrant.id;
    cur_set.entrant1Name = node.slots[0].entrant.name;
    cur_set.entrant2Name = node.slots[1].entrant.name;

    var match_done = true;

    if (node.slots[0].standing == null) {
      cur_set.entrant1Score = -1;
      match_done = false;
    } else if (node.slots[0].standing.stats.score.value != null) {
      cur_set.entrant1Score = node.slots[0].standing.stats.score.value;
    } else {
      cur_set.entrant1Score = -1;
    }

    if (node.slots[1].standing == null) {
      cur_set.entrant2Score = -1;
      match_done = false;
    } else if (node.slots[1].standing.stats.score.value != null) {
      cur_set.entrant2Score = node.slots[1].standing.stats.score.value;
    } else {
      cur_set.entrant2Score = -1;
    }

    if (match_done) {
      cur_set.completed = true;
      if (node.slots[0].standing.placement == 1) {
        cur_set.winnerId = cur_set.entrant1Id;
        cur_set.loserId = cur_set.entrant2Id;
        cur_set.winnerName = cur_set.entrant1Name;
        cur_set.loserName = cur_set.entrant2Name;
      } else if (node.slots[0].standing.placement == 2) {
        cur_set.winnerId = cur_set.entrant2Id;
        cur_set.loserId = cur_set.entrant1Id;
        cur_set.winnerName = cur_set.entrant2Name;
        cur_set.loserName = cur_set.entrant1Name;
      }
    } else {
      cur_set.completed = false;
    }

    cur_set.setRound = node.fullRoundText;
    cur_set.bracketId = node.phaseGroup.id;

    sets.push(cur_set);
  }

  return sets;
}

// Filter for the show_head_to_head function
export function show_head_to_head_filter(response, player2_name) {
  if (response.event === null) {
    return;
  }

  if (response.event.sets.nodes === null) {
    return;
  }

  var sets = [];

  for (var node of response.event.sets.nodes) {
    var cur_set = {};
    // Yes, the if statement needs to be this long to account for all cases
    // I don't want to run another query, smash.gg's API can be trash sometimes
    if (
      node.slots[0].entrant.name.split('|').pop().toLowerCase() == player2_name.toLowerCase() ||
      node.slots[0].entrant.name.toLowerCase() == player2_name.toLowerCase() ||
      node.slots[1].entrant.name.split('|').pop().toLowerCase() == player2_name.toLowerCase() ||
      node.slots[1].entrant.name.toLowerCase() == player2_name.toLowerCase()
    ) {
      cur_set = {};
      cur_set.id = node.id;
      cur_set.entrant1Id = node.slots[0].entrant.id;
      cur_set.entrant2Id = node.slots[1].entrant.id;
      cur_set.entrant1Name = node.slots[0].entrant.name;
      cur_set.entrant2Name = node.slots[1].entrant.name;

      // Next 2 if/else blocks make sure there's a result in, sometimes DQs are weird
      var match_done = true;
      if (node.slots[0].standing === null) {
        cur_set.entrant1Score = -1;
        match_done = false;
      } else if (node.slots[0].standing.stats.score.value !== null) {
        cur_set.entrant1Score = node.slots[0].standing.stats.score.value;
      } else {
        cur_set.entrant1Score = -1;
      }

      if (node.slots[1].standing === null) {
        cur_set.entrant2Score = -1;
        match_done = false;
      } else if (node.slots[1].standing.stats.score.value !== null) {
        cur_set.entrant2Score = node.slots[1].standing.stats.score.value;
      } else {
        cur_set.entrant2Score = -1;
      }

      // Determining winner/loser (elif because sometimes startgg won't give us one)
      if (match_done) {
        cur_set.completed = true;
        if (node.slots[0].standing.placement == 1) {
          cur_set.winnerId = cur_set.entrant1Id;
          cur_set.loserId = cur_set.entrant2Id;
          cur_set.winnerName = cur_set.entrant1Name;
          cur_set.loserName = cur_set.entrant2Name;
        } else if (node.slots[0].standing.placement == 2) {
          cur_set.winnerId = cur_set.entrant2Id;
          cur_set.loserId = cur_set.entrant1Id;
          cur_set.winnerName = cur_set.entrant2Name;
          cur_set.loserName = cur_set.entrant1Name;
        }
      } else {
        cur_set.completed = false;
      }

      cur_set.setRound = node.fullRoundText;
      cur_set.bracketId = node.phaseGroup.id;

      sets.push(cur_set);
    }
  }

  return sets;
}


// Filter for the show_event_by_game_size_dated function
export function show_event_by_game_size_dated_filter(response, size, videogame_id) {
  if (!response) {
    return;
  }

  if (!response.tournaments) {
    return;
  }

  if (!response.tournaments.nodes) {
    return;
  }

  const events = [];

  for (const node of response.tournaments.nodes) {
    for (const event of node.events) {
      if (!event.numEntrants || !event.videogame.id) {
        continue;
      } else if (event.videogame.id === videogame_id && event.numEntrants >= size) {
        const cur_event = {
          tournamentName: node.name,
          tournamentSlug: node.slug.split('/').pop(),
          tournamentId: node.id,
          online: node.isOnline,
          startAt: node.startAt,
          endAt: node.endAt,
          eventName: event.name,
          eventId: event.id,
          numEntrants: event.numEntrants,
        };

        events.push(cur_event);
      }
    }
  }

  return events;
}

// Filter for the show_lightweight_results function
export function show_lightweight_results_filter(response) {
  if (!response.event) {
    return;
  }
  if (!response.event.standings.nodes) {
    return;
  }

  const entrants = [];

  for (const node of response.event.standings.nodes) {
    const cur_entrant = {};
    cur_entrant.placement = node.placement;
    cur_entrant.name = node.entrant.name.split(' | ').pop();
    cur_entrant.id = node.entrant.id;

    entrants.push(cur_entrant);
  }

  return entrants;
}

// Filter for the show_by_country function
export function show_by_country_filter(response) {
  if (response.tournaments == null) {
    return;
  }

  if (response.tournaments.nodes == null) {
    return;
  }

  const tournaments = [];

  for (const node of response.tournaments.nodes) {
    const cur_tournament = {};
    cur_tournament.id = node.id;
    cur_tournament.name = node.name;
    cur_tournament.slug = node.slug.split('/').pop();
    cur_tournament.entrants = node.numAttendees;
    cur_tournament.city = node.city;
    cur_tournament.startTimestamp = node.startAt;
    cur_tournament.endTimestamp = node.endAt;

    if (node.state === 3) {
      cur_tournament.completed = true;
    } else {
      cur_tournament.completed = false;
    }

    tournaments.push(cur_tournament);
  }

  return tournaments;
}


// Filter for the show_by_state function
export function show_by_state_filter(response) {
  if (response.tournaments == null) {
    return;
  }

  if (response.tournaments.nodes == null) {
    return;
  }

  const tournaments = [];

  for (const node of response.tournaments.nodes) {
    const cur_tournament = {};
    cur_tournament.id = node.id;
    cur_tournament.name = node.name;
    cur_tournament.slug = node.slug.split('/').pop();
    cur_tournament.entrants = node.numAttendees;
    cur_tournament.city = node.city;
    cur_tournament.startTimestamp = node.startAt;
    cur_tournament.endTimestamp = node.endAt;

    if (node.state === 3) {
      cur_tournament.completed = true;
    } else {
      cur_tournament.completed = false;
    }

    tournaments.push(cur_tournament);
  }

  return tournaments;
}

export function show_by_radius_filter(response) {
  if (!response.tournaments) {
    return;
  }

  if (!response.tournaments.nodes) {
    return;
  }

  const tournaments = [];

  for (const node of response.tournaments.nodes) {
    const cur_tournament = {};
    cur_tournament.id = node.id;
    cur_tournament.name = node.name;
    cur_tournament.slug = node.slug.split('/').pop();
    cur_tournament.entrants = node.numAttendees;
    cur_tournament.country = node.countryCode;
    cur_tournament.state = node.addrState;
    cur_tournament.city = node.city;
    cur_tournament.startTimestamp = node.startAt;
    cur_tournament.endTimestamp = node.endAt;

    tournaments.push(cur_tournament);
  }

  return tournaments;
}


export function show_players_by_sponsor_filter(response) {
  if (response.tournament === null) {
    return;
  }

  if (response.tournament.participants.nodes === null) {
    return;
  }

  const players = [];

  for (const node of response.tournament.participants.nodes) {
    const cur_player = {};
    cur_player.tag = node.gamerTag;
    if (node.user !== null) {
      cur_player.playerId = response.user.player.id;
      cur_player.name = response.user.name;
      cur_player.country = response.user.location.country;
      cur_player.state = response.user.location.state;
      cur_player.city = response.user.location.city;
    }

    players.push(cur_player);
  }

  return players;
}

export function show_by_owner_filter(response) {
  if (response.tournaments === null) {
    return;
  }

  if (response.tournaments.nodes === null) {
    return;
  }

  const tournaments = [];

  for (const node of response.tournaments.nodes) {
    const cur_tournament = {};
    cur_tournament.id = node.id;
    cur_tournament.name = node.name;
    cur_tournament.slug = node.slug.split('/').pop();
    cur_tournament.entrants = node.numAttendees;
    cur_tournament.country = node.countryCode;
    cur_tournament.state = node.addrState;
    cur_tournament.city = node.city;
    cur_tournament.startTimestamp = node.startAt;
    cur_tournament.endTimestamp = node.endAt;

    tournaments.push(cur_tournament);
  }

  return tournaments;
}

// BRACKETS.PY

// Filter for the show_entrants function
export function bracket_show_entrants_filter(response) {
  if (response.phaseGroup == null) {
    return;
  }

  if (response.phaseGroup.seeds.nodes == null) {
    return;
  }

  var entrants = [];

  for (var node of response.phaseGroup.seeds.nodes) {
    var cur_entrant = {};
    cur_entrant.entrantId = node.entrant.id;
    cur_entrant.tag = node.entrant.name;
    cur_entrant.finalPlacement = node.placement;
    cur_entrant.seed = node.seedNum;

    var players = [];
    for (var user of node.entrant.participants) {
      var cur_player = {};
      cur_player.playerId = user.player.id;
      cur_player.playerTag = user.player.gamerTag;
      players.push(cur_player);
    }
    cur_entrant.entrantPlayers = players;

    entrants.push(cur_entrant);
  }

  return entrants;
}

// Filter for the show_sets function
export function bracket_show_sets_filter(response) {
  if (response.phaseGroup === null) {
    return;
  }

  if (response.phaseGroup.sets.nodes === null) {
    return;
  }

  var bracket_name = response.phaseGroup.phase.name;
  var sets = [];

  for (var i = 0; i < response.phaseGroup.sets.nodes.length; i++) {
    var node = response.phaseGroup.sets.nodes[i];
    var cur_set = {};
    cur_set.id = node.id;
    cur_set.entrant1Id = node.slots[0].entrant.id;
    cur_set.entrant2Id = node.slots[1].entrant.id;
    cur_set.entrant1Name = node.slots[0].entrant.name;
    cur_set.entrant2Name = node.slots[1].entrant.name;

    var match_done = true;

    if (node.slots[0].standing === null) {
      cur_set.entrant1Score = -1;
      match_done = false;
    } else if (node.slots[0].standing.stats.score.value !== null) {
      cur_set.entrant1Score = node.slots[0].standing.stats.score.value;
    } else {
      cur_set.entrant1Score = -1;
    }

    if (node.slots[1].standing === null) {
      cur_set.entrant2Score = -1;
      match_done = false;
    } else if (node.slots[1].standing.stats.score.value !== null) {
      cur_set.entrant2Score = node.slots[1].standing.stats.score.value;
    } else {
      cur_set.entrant2Score = -1;
    }

    if (match_done) {
      cur_set.completed = true;
      if (node.slots[0].standing.placement === 1) {
        cur_set.winnerId = cur_set.entrant1Id;
        cur_set.loserId = cur_set.entrant2Id;
        cur_set.winnerName = cur_set.entrant1Name;
        cur_set.loserName = cur_set.entrant2Name;
      } else if (node.slots[0].standing.placement === 2) {
        cur_set.winnerId = cur_set.entrant2Id;
        cur_set.loserId = cur_set.entrant1Id;
        cur_set.winnerName = cur_set.entrant2Name;
        cur_set.loserName = cur_set.entrant1Name;
      }
    } else {
      cur_set.completed = false;
    }

    cur_set.bracketName = bracket_name;

    for (var j = 0; j < 2; j++) {
      var players = [];
      for (var k = 0; k < node.slots[j].entrant.participants.length; k++) {
        var user = node.slots[j].entrant.participants[k];
        var cur_player = {};
        cur_player.playerId = user.player.id;
        cur_player.playerTag = user.player.gamerTag;
        players.push(cur_player);
      }
      cur_set['entrant' + (j + 1) + 'Players'] = players;
    }

    sets.push(cur_set);
  }

  return sets;
}


// PLAYERS.PY

// Filter for the get_info function
export function player_show_info_filter(response) {
  if (response.player == null || response.player.user == null) {
    return;
  }

  const player = {};
  player.tag = response.player.gamerTag;
  player.name = response.player.user.name;
  player.bio = response.player.user.name;

  if (response.player.user.location != null) {
    player.country = response.player.user.location.country;
    player.state = response.player.user.location.state;
    player.city = response.player.user.location.city;
  } else {
    player.country = null;
    player.state = null;
    player.city = null;
  }

  player.rankings = response.player.rankings;

  return player;
}

// Filter for the get_tournaments function
export function player_show_tournaments_filter(response) {
  if (response.player == null) {
    return;
  }
  if (response.player.user.tournaments.nodes == null) {
    return;
  }

  var tournaments = [];

  for (var i = 0; i < response.player.user.tournaments.nodes.length; i++) {
    var node = response.player.user.tournaments.nodes[i];
    var cur_tournament = {};
    cur_tournament.name = node.name;
    cur_tournament.slug = node.slug.split('/').pop();
    cur_tournament.id = node.id;
    cur_tournament.attendees = node.numAttendees;
    cur_tournament.country = node.countryCode;
    cur_tournament.unixTimestamp = node.startAt;

    tournaments.push(cur_tournament);
  }

  return tournaments;
}

// Filter for the show_tournaments_for_game function
export function player_show_tournaments_for_game(response, videogame_id) {
  if (response.player == null) {
    return;
  }
  if (response.player.user.tournaments.nodes == null) {
    return;
  }

  const tournaments = [];

  for (const node of response.player.user.tournaments.nodes) {
    for (const event of node.events) {
      if (event.videogame.id == videogame_id && event.entrants.nodes != null) {
        const cur_tournament = {};
        cur_tournament.name = node.name;
        cur_tournament.slug = node.slug.split('/').slice(-1)[0];
        cur_tournament.id = node.id;
        cur_tournament.attendees = node.numAttendees;
        cur_tournament.country = node.countryCode;
        cur_tournament.startTimestamp = node.startAt;
        cur_tournament.eventName = event.name;
        cur_tournament.eventSlug = event.slug.split('/').slice(-1)[0];
        cur_tournament.eventId = event.id;
        cur_tournament.eventEntrants = event.numEntrants;

        tournaments.push(cur_tournament);
      }
    }
  }

  return tournaments;
}

// LEAGUES.PY

// Filter for the show function
export function league_show_filter(response) {
  if (response.league) {
    return
  }
  var data = {}
  data.id = response.league.id
  data.name = response.league.name
  data.startTimestamp = response.league.startAt
  data.endTimestamp = response.league.endAt
  data.games = response.league.videogames

  return data
}
// Filter for the show_schedule function
export function league_show_schedule_filter(response) {
  if (response.league == null) {
    return;
  }

  if (response.league.events.nodes == null) {
    return;
  }

  var events = [];

  for (var node of response.league.events.nodes) {
    var cur_event = {};
    cur_event.eventId = node.id;
    cur_event.eventName = node.name;
    cur_event.eventSlug = node.slug.split('/').pop();
    cur_event.eventStartTimestamp = node.startAt;
    cur_event.eventEntrants = node.numEntrants;
    cur_event.tournamentId = node.tournament.id;
    cur_event.tournamentName = node.tournament.name;
    cur_event.tournamentSlug = node.tournament.slug.split('/').pop();

    events.push(cur_event);
  }

  return events;
}

// Filter for the show_standings function
export function league_show_standings_filter(response) {
  if (response.league == null) {
    return;
  }

  if (response.league.standings.nodes == null) {
    return;
  }

  const players = [];

  for (const node of response.league.standings.nodes) {
    const cur_player = {};
    cur_player.id = node.id;
    cur_player.standing = node.placement;
    if (node.player != null) { // startgg is weird sometimes
      cur_player.name = node.player.gamerTag;
      cur_player.playerId = node.player.id;
    } else {
      cur_player.name = "startgg has a bug, ignore this one and playerId please -- very sorry";
      cur_player.playerId = null;
    }
    players.push(cur_player);
  }
  return players;
}