// Queries for events.py
import {
  gql
} from 'graphql-request';

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
      perPage: 24,
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