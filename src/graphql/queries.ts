import { gql } from '@apollo/client';

export const GET_JOBS_QUERY = gql`
  query transcriptionJobs {
    transcriptionJobs {
      id
      status
      transcriptionText
      createdAt
    }
  }
`;

export const GET_JOB_QUERY = gql`
  query GetJob($id: ID!) {
    transcriptionJobs(id: $id) {
      id
      status
      transcriptionText
      createdAt
    }
  }
`;