import React from 'react';
import {Alert, Card, Empty, List, Space, Spin, Tag, Typography} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined} from '@ant-design/icons';
import {useQuery} from '@apollo/client/react';
import {GET_JOBS_QUERY} from '../graphql/queries';
import {Job} from '../types';
import {TranscriptionJobStatus} from "../types/enums";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const JobList: React.FC = () => {
    const { data, loading, error } = useQuery(GET_JOBS_QUERY, {
        pollInterval: 2000,
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case TranscriptionJobStatus.PROCESSING:
                return {
                    color: 'blue',
                    icon: <LoadingOutlined />,
                    text: 'В обработке'
                };
            case TranscriptionJobStatus.COMPLETED:
                return {
                    color: 'green',
                    icon: <CheckCircleOutlined />,
                    text: 'Завершено'
                };
            case TranscriptionJobStatus.FAILED:
                return {
                    color: 'red',
                    icon: <CloseCircleOutlined />,
                    text: 'Ошибка'
                };
            default:
                return {
                    color: 'default',
                    icon: null,
                    text: status
                };
        }
    };

    const formatDate = (dateString: string) => {
        return dayjs(+dateString).format('DD.MM.YYYY HH:mm');
    };

    if (error) {
        return (
            <Alert
                message="Ошибка загрузки задач"
                description={error.message}
                type="error"
                showIcon
            />
        );
    }

    const jobsData: any = data;
    const jobs: Job[] = jobsData?.transcriptionJobs || [];

    return (
        <div>
            {loading && !data && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                </div>
            )}

            {!loading && jobs.length === 0 && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Нет задач транскрибации"
                />
            )}

            <List
                dataSource={jobs}
                renderItem={(job: Job) => (
                    <List.Item>
                        <Card
                            className="job-card"
                            title={
                                <Space>
                                    <Text strong>Задача #{job.id?.slice(-6) || 'N/A'}</Text>
                                    <Tag
                                        color={getStatusConfig(job.status).color}
                                        icon={getStatusConfig(job.status).icon}
                                    >
                                        {getStatusConfig(job.status).text}
                                    </Tag>
                                </Space>
                            }
                            extra={
                                <Text type="secondary">
                                    {job.createdAt ? formatDate(job.createdAt) : 'N/A'}
                                </Text>
                            }
                            style={{ width: '100%' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                {job.status === TranscriptionJobStatus.PROCESSING && (
                                    <div>
                                        <Spin indicator={<LoadingOutlined spin />} />
                                        <Text type="secondary" style={{ marginLeft: 8 }}>
                                            Идет обработка аудио...
                                        </Text>
                                    </div>
                                )}

                                {job.status === TranscriptionJobStatus.COMPLETED && job.transcriptionText && (
                                    <div>
                                        <Title level={5}>Результат транскрибации:</Title>
                                        <Card
                                            size="small"
                                            style={{
                                                background: '#fafafa',
                                                border: '1px dashed #d9d9d9'
                                            }}
                                        >
                                            <Text>{job.transcriptionText}</Text>
                                        </Card>
                                    </div>
                                )}

                                {job.status === TranscriptionJobStatus.FAILED && (
                                    <Alert
                                        message="Ошибка обработки"
                                        description="Произошла ошибка во время обработки аудиофайла. Попробуйте загрузить файл еще раз."
                                        type="error"
                                        showIcon
                                    />
                                )}
                            </Space>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default JobList;