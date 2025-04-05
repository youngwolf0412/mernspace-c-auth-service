import { DataSource } from "typeorm";

export const truncateTables = async (connection: DataSource) => {
  // Get all entity metadata from the connection
  // This will give you all the tables in the database
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.clear(); // Clear the table
  }
};
