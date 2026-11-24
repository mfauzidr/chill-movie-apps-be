
interface DatabaseError {
  code?: string;
  message?: string;
  sqlMessage?: string;
}

export const getDbErrorMessage = (err: DatabaseError): string => {
  switch (err.code) {
    case "ER_DUP_ENTRY": {
      const message = err.sqlMessage || err.message || "";

      const match = message.match(/for key ['`](.*?)['`]/);
      const key = match?.[1]?.split(".").pop() ?? "";

      const field = key
        .replace(/^(uq_|unique_)/, "")
        .replace(/_unique$/, "")
        .split("_")
        .pop();

      if (field) {
        const formattedField =
          field.charAt(0).toUpperCase() + field.slice(1);

        return `${formattedField} already exists.`;
      }

      return "Value already exists.";
    }

    case "ER_BAD_NULL_ERROR":
      return `${err.sqlMessage || "Required field"} cannot be empty.`;

    case "ER_DATA_TOO_LONG":
      return "Input exceeds the allowed length.";

    case "ER_NO_REFERENCED_ROW_2":
      return "Referenced record does not exist.";

    case "ER_ROW_IS_REFERENCED_2":
      return "Record is still being referenced.";

    default:
      return "Database error.";
  }
};
