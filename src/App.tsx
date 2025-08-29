import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { Layout, Typography } from 'antd';
import { client } from './graphql/client';
import JobList from './components/JobList';
import 'antd/dist/reset.css';
import './App.css';
import AudioUploader from "./components/AudioUploader";

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <Layout style={{ minHeight: '100vh' }}>
                <Header style={{
                    background: '#fff',
                    boxShadow: '0 2px 8px #f0f1f2',
                    padding: '0 24px'
                }}>
                    <Title level={2} style={{ margin: '16px 0', color: '#1890ff' }}>
                        🎵 Сервис транскрибации аудио
                    </Title>
                </Header>

                <Content style={{ padding: '24px', background: '#f5f5f5' }}>
                    <div style={{
                        background: '#fff',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12), 0 5px 12px 4px rgba(0,0,0,0.09)'
                    }}>
                        <Title level={3}>Загрузите аудиофайл</Title>
                        <AudioUploader />

                        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #d9d9d9' }} />

                        <Title level={3}>История задач</Title>
                        <JobList />
                    </div>
                </Content>
            </Layout>
        </ApolloProvider>
    );
};

export default App;