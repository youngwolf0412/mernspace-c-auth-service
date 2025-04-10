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

export const isJwt = (token: string | null): boolean => {
  if (token === null) return false; // Check if token is null
  const parts = token.split(".");
  if (parts.length !== 3) return false; // JWT should have 3 parts
  try {
    parts.forEach((part) => {
      Buffer.from(part, "base64").toString("utf8");
    });
    return true;
  } catch (error) {
    return false;
  }
};
