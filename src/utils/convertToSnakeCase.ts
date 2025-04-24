const convertToSnakeCase = (str: string): string => {
  return str
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_]/g, "") // Remove non-alphanumeric characters except underscores
    .toLowerCase(); // Convert to lowercase
};

export default convertToSnakeCase;
