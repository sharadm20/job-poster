import { gql } from 'graphql-tag';

// GraphQL schema definition
export const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    location: String
    experience: Int
    skills: [String]
    preferences: UserPreferences
  }

  type UserPreferences {
    location: String
    remote: Boolean
    jobTypes: [String]
    salary: Int
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Job {
    id: ID!
    title: String!
    company: String!
    location: String!
    postedDate: String!
    url: String!
    source: String!
    remote: Boolean
    salary: String
    jobType: String
    experienceLevel: String
    skills: [String]
    benefits: [String]
  }

  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]

    # Job queries
    jobs: [Job!]
    job(id: ID!): Job
    userJobs: [Job!]
  }

  type Mutation {
    # User mutations
    register(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      location: String
      experience: Int
      skills: [String]
      preferences: UserPreferencesInput
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    # Job mutations
    scrapeJobs(
      source: String!
      keywords: [String!]!
      location: String!
      maxResults: Int
    ): [Job!]
  }

  input UserPreferencesInput {
    location: String
    remote: Boolean
    jobTypes: [String]
    salary: Int
  }
`;