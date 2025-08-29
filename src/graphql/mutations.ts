import { gql } from '@apollo/client';

export const CREATE_UPLOAD_MUTATION = gql`
mutation CreateUpload($input: UploadFileInput!) {
  createUploadUrl(input: $input) {
    url
    file {
      id
      url
      originalName
      mimetype
    }
  }
}
`;

export const CONFIRM_UPLOAD_MUTATION = gql`
  mutation ConfirmUpload($fileId: Int!) {
    confirmUpload(fileId: $fileId) {
      id
      status
      file {
        id
        originalName
      }
    }
  }
`;