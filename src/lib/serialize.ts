/**
 * Deep-serializes MongoDB/Mongoose documents into plain objects safe for
 * passing from Server Components to Client Components.
 *
 * Handles:
 * - BSON ObjectId  → hex string
 * - Buffer/Binary  → hex string
 * - Date           → preserved as-is (JSON.stringify handles it)
 * - Nested objects and arrays recursively
 */
export function toPlain<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      if (value == null) return value;

      // BSON ObjectId (all variants: driver v4, v5, v6)
      if (
        typeof value === "object" &&
        (value._bsontype === "ObjectId" ||
          value._bsontype === "ObjectID" ||
          value.constructor?.name === "ObjectId" ||
          value.constructor?.name === "ObjectID")
      ) {
        return value.toString();
      }

      // Node.js Buffer or BSON Binary
      if (Buffer.isBuffer(value)) {
        return value.toString("hex");
      }
      if (typeof value === "object" && value._bsontype === "Binary") {
        return (value.buffer as Buffer).toString("hex");
      }

      return value;
    })
  );
}
