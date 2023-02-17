// Queries for tournaments.py

import {
  gql
} from 'graphql-request';

export const PLAYER_ID_QUERY = gql `query EventEntrants($eventId: ID!, $name: String!) {
    event(id: $eventId) {
    entrants(query: {
      page: 1
      perPage: 32
      filter: {name: $name}
    }) {
      nodes {
        participants {
          gamerTag
          player {
            id 
          }
        }
      }
    }
  }
}`

export const EVENT_ID_QUERY = gql `query ($tourneySlug: String!) {
  tournament(slug: $tourneySlug) {
    events {
      id
      slug
    }
  }
}`

export const ENTRANT_ID_QUERY = gql `query EventEntrants($eventId: ID!, $name: String!) {
    event(id: $eventId) {
    entrants(query: {
      page: 1
      perPage: 32
      filter: {
        name: $name
      }
    }) {
      nodes {
        id
        name
      }
    }
  }
}`

export const SHOW_QUERY = gql `query ($tourneySlug: String!) {
  tournament(slug: $tourneySlug) {
    id
    name
    countryCode
    addrState
    city
    startAt
    endAt
    numAttendees
  }
}`


export const SHOW_WITH_BRACKETS_QUERY = gql `query ($tourneySlug: String!) {
  tournament(slug: $tourneySlug) {
    id
    name
    countryCode
    addrState
    city
    startAt
    endAt
    numAttendees
    events {
      id
      name
      slug
      phaseGroups {
        id
      }
    }
  }
}`

export const SHOW_EVENTS_QUERY = gql `query ($tourneySlug: String!) {
  tournament(slug: $tourneySlug) {
    events {
      id
      name
      slug
      numEntrants
    }
  }
}`

export const SHOW_SETS_QUERY = gql `query EventSets($eventId: ID!, $page: Int!) {
  event(id: $eventId) {
    tournament {
      id
      name
    }
    name
    sets(page: $page, perPage: 18, sortType: STANDARD) {
      nodes {
        fullRoundText
        games {
          winnerId
          selections {
            selectionValue
            entrant {
              id
            }
          }
        }
        id
        slots {
          standing {
            id
            placement
            stats {
              score {
                value
              }
            }
          }
          entrant {
            id
            name
            participants {
              entrants {
                id
              }
              player {
                id
                gamerTag
                
              }
            }
          }
        }
        phaseGroup {
          id
          phase {
            name
          }
        }
      }
    }
  }
}`


export const SHOW_ENTRANTS_QUERY = gql `query EventStandings($eventId: ID!, $page: Int!) {
  event(id: $eventId) {
    id
    name
    standings(query: {
      perPage: 25,
      page: $page}){
      nodes {
        placement
        entrant {
          id
          name
          participants {
            player {
              id
              gamerTag
            }
          }
          seeds {
            seedNum
          }
        }
      }
    }
  }
}`

export const SHOW_EVENT_BRACKETS_QUERY = gql `query ($tourneySlug: String!) {
  tournament(slug: $tourneySlug) {
    events {
      name
      slug
      phaseGroups {
        id
      }
    }
  }
}`

export const SHOW_ENTRANT_SETS_QUERY = gql `query EventSets($eventId: ID!, $entrantId: ID!, $page: Int!) {
  event(id: $eventId) {
    sets(
      page: $page
      perPage: 16
      filters: {
        entrantIds: [$entrantId]
      }
    ) {
      nodes {
        id
        fullRoundText
        slots {
          standing {
            placement
            stats {
              score {
                value
              }
            }
          }
          entrant {
            id
            name
          }
        }
        phaseGroup {
          id
        }
      }
    }
  }
}`

export const SHOW_EVENT_BY_GAME_SIZE_DATED_QUERY = gql `query TournamentsByVideogame($page: Int!, $videogameId: [ID!], $after: Timestamp!, $before: Timestamp!) {
  tournaments(query: {
    perPage: 32
    page: $page
    sortBy: "startAt asc"
    filter: {
      past: false
      videogameIds: $videogameId
      afterDate: $after
      beforeDate: $before
    }
  }) {
    nodes {
      name
      id
      slug
      isOnline
      startAt
      endAt
      events {
        name
        id
        numEntrants
        videogame {
          id
        }
      }
    }
  }
}`

export const SHOW_LIGHTWEIGHT_RESULTS_QUERY = gql `query EventStandings($eventId: ID!, $page: Int!,) {
  event(id: $eventId) {
    standings(query: {
      perPage: 64,
      page: $page
    }){
      nodes {
        placement
        entrant {
          name
          id
        }
      }
    }
  }
}`

export const SHOW_BY_COUNTRY_QUERY = gql `query TournamentsByCountry($countryCode: String!, $page: Int!) {
  tournaments(query: {
    perPage: 32,
    page: $page,
    sortBy: "startAt desc"
    filter: {
      countryCode: $countryCode
    }
  }) {
    nodes {
      id
      name
      slug
      numAttendees
      addrState
      city
      startAt
      endAt
      state
    }
  }
}`

export const SHOW_BY_STATE_QUERY = gql `query TournamentsByState($state: String!, $page: Int!) {
  tournaments(query: {
    perPage: 32
    page: $page
    filter: {
      addrState: $state
    }
  }) {
    nodes {
      id
      name
      slug
      numAttendees
      city
      startAt
      endAt
      state
    }
  }
}`

export const SHOW_BY_RADIUS_QUERY = gql `query ($page: Int, $coordinates: String!, $radius: String!) {
  tournaments(query: {
    page: $page
    perPage: 32
    filter: {
      location: {
        distanceFrom: $coordinates,
        distance: $radius
      }
    }
  }) {
    nodes {
      id
      name
      slug
      numAttendees
      countryCode
      addrState
      city
      startAt
      endAt
      state
    }
  }
}`

export const SHOW_PLAYERS_BY_SPONSOR = gql `query ($slug:String!, $sponsor: String!) {
  tournament(slug: $slug) {
    participants(query: {
      filter: {
        search: {
          fieldsToSearch: ["prefix"],
          searchString: $sponsor
        }
      }
    }) {
      nodes {
        id
        gamerTag
        user {
          name
          location {
            country
            state
            city
          }
          player {
            id
          }
        }
      }
    }
  }
}`

export const SHOW_BY_OWNER_QUERY = gql `query TournamentsByOwner($ownerId: ID!, $page: Int!) {
    tournaments(query: {
      perPage: 25,
      page: $page,
      filter: { ownerId: $ownerId }
    }) {
    nodes {
      id
      name
      slug
	  numAttendees
      countryCode
      addrState
      city
      startAt
      endAt
      state
    }
  }
}`