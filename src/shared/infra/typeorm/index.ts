import { createConnections, Connection } from 'typeorm';

const createDbConnection = async (): Promise<Connection[]> => {
  const connection = await createConnections();
  // console.log(connection);
  return connection;
};

createDbConnection();
