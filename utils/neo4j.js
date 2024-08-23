const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    'bolt://34.239.240.81:7687',
    neo4j.auth.basic('neo4j', 'arraignment-square-combs')
);

const session = driver.session();

const closeDriver = async () => {
    await driver.close();
};

module.exports = {
    session,
    closeDriver
};
