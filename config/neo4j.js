const neo4j = require('neo4j-driver');
require('dotenv').config();

// Initialize the Neo4j driver
const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password')
);

// Create a session from the driver
const session = driver.session();

// Function to run queries
const runQuery = async (query, params = {}) => {
    const session = driver.session();
    try {
        const result = await session.writeTransaction(async (tx) => {
            return await tx.run(query, params);
        });
        return result;
    } catch (error) {
        console.error('Error in query execution:', error);
        throw error;
    } finally {
        session.close();
    }
};

module.exports = { driver, session, runQuery };
