import { createConnection, Connection } from 'typeorm';

const createDbConnection = async (): Promise<Connection> => {
  const connection = await createConnection();
  // console.log(connection);
  return connection;
};

createDbConnection();
