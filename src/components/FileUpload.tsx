import React, { useState } from 'react';
import {
    Upload,
    Button,
    message,
    Card,
    Space,
    Progress,
    Typography,
} from 'antd';
import {
    UploadOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { useMutation } from '@apollo/client/react';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { CREATE_UPLOAD_MUTATION } from '../graphql/mutations';

const { Text } = Typography;

interface FileUploadProps {
    onUpload: (fileId: number) => void
}

const FileUpload: React.FC<FileUploadProps> = ({onUpload}) => {
    const [createUpload] = useMutation(CREATE_UPLOAD_MUTATION);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const customRequest = async (options: UploadRequestOption) => {
        const { file, onSuccess, onError }: Record<any, any> = options;

        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const { data }: any = await createUpload({
                variables: {
                    input: {
                        originalName: file.name,
                        mimetype: file.type,
                        bytes: file.size,
                    },
                },
            });

            if (!data?.createUploadUrl?.url) {
                throw new Error('Не удалось получить presigned URL');
            }

            const { url, file: dbFile } = data.createUploadUrl;

            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Content-Type', dbFile.type);

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            });

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    onSuccess?.(xhr.response, file);
                    setUploadProgress(100);
                    message.success('Файл успешно загружен!');
                } else {
                    throw new Error(`Ошибка загрузки: ${xhr.status}`);
                }
                setTimeout(() => {
                    setIsUploading(false);
                    setUploadProgress(0);
                    onUpload(dbFile.id);
                }, 1000);
            };

            xhr.onerror = () => {
                onError?.(new Error('Ошибка сети'));
                setIsUploading(false);
                message.error('Ошибка сети при загрузке файла');
            };

            xhr.send(file);
        } catch (error: any) {
            onError?.(error);
            setIsUploading(false);
            message.error('Ошибка при загрузке файла: ' + error.message);
        }
    };

    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Upload
                    customRequest={customRequest}
                    showUploadList={false}
                    disabled={isUploading}
                >
                    <Button
                        icon={isUploading ? <LoadingOutlined /> : <UploadOutlined />}
                        size="large"
                        type="primary"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Загрузка...' : 'Выбрать аудиофайл'}
                    </Button>
                </Upload>

                {isUploading && (
                    <div>
                        <Progress
                            percent={uploadProgress}
                            status={uploadProgress === 100 ? 'success' : 'active'}
                            showInfo
                        />
                        <Text type="secondary">
                            {uploadProgress === 100
                                ? 'Загрузка завершена'
                                : `Загрузка: ${uploadProgress}%`}
                        </Text>
                    </div>
                )}

                <Text type="secondary">
                    Поддерживаемые форматы: MP3, WAV, AAC и другие
                </Text>
            </Space>
        </Card>
    );
};

export default FileUpload;
