import {TranscriptionJobStatus} from "./enums";

export interface Job {
    id: string;
    status: TranscriptionJobStatus;
    transcriptionText?: string;
    createdAt: string;
}

export interface PresignedUrlResponse {
    url: string;
    fields: { [key: string]: string };
}