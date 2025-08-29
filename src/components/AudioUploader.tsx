import React from "react";
import FileUpload from "./FileUpload";
import { useMutation } from "@apollo/client/react";
import {CONFIRM_UPLOAD_MUTATION} from "../graphql/mutations";

const AudioUploader: React.FC = () => {
    const [confirmUpload] = useMutation(CONFIRM_UPLOAD_MUTATION, {
        refetchQueries: ["GetTranscriptionJobs"],
    });

    const onUpload = (fileId: number) => {
        setTimeout(async () => {
            try {
                await confirmUpload({ variables: { fileId: +fileId } });
                console.log("Upload confirmed for file:", fileId);
            } catch (err) {
                console.error("Ошибка confirmUpload:", err);
            }
        }, 15000);
    };

    return <FileUpload onUpload={onUpload} />;
};

export default AudioUploader;
