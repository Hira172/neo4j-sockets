const { session } = require('../utils/neo4j');

const getCounterValue = async () => {
    const result = await session.run('MATCH (c:Counter) RETURN c.value AS value');
    if (result.records.length > 0) {
        return result.records[0].get('value');
    }
    return 0;
};

const incrementCounter = async (value) => {
    await session.run('MERGE (c:Counter) SET c.value = coalesce(c.value, 0) + 1 RETURN c.value AS value');
};

module.exports = {
    getCounterValue,
    incrementCounter
};
