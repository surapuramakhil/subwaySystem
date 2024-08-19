import dotenv from 'dotenv';

dotenv.config();

const config = {
    server: {
        port: process.env.PORT || 3000
    },
    DB: {
        postgres: {
            url: process.env.POSTGRES_URL || 'postgresql://subway_user:subway_password@db:5432/subway_system'
        },
        neo4j: {
            uri: process.env.NEO4J_URI || 'bolt://neo4j:7687',
            user: process.env.NEO4J_USER || 'neo4j',
            password: process.env.NEO4J_PASSWORD || 'password'
        }
    }
}

export default config;