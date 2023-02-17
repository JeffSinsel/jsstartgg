// Queries for leagues.py
import {
  gql
} from 'graphql-request';

export const SHOW_QUERY = gql `query ($slug: String!){
  league(slug: $slug) {
    id
    name
    startAt
    endAt
    videogames {
      displayName
      id
    }
  }
}`

export const SHOW_SCHEDULE_QUERY = gql `query LeagueSchedule ($slug: String!, $page: Int!){
  league(slug: $slug) {
    id
    name
    events(query: {
      page: $page,
      perPage: 20
    }) {
      nodes {
        id
        name
        slug
        startAt
        numEntrants
        tournament {
          id
          name
          slug
        }
      }
    }
  }
}`

export const SHOW_STANDINGS_QUERY = gql `query LeagueStandings ($slug: String!, $page: Int!){
  league(slug: $slug) {
    standings (query: {
      page: $page,
      perPage: 25
    }) {
      nodes {
        id
        placement
        player {
          id
          gamerTag
        }
      }
    }
  }
}`