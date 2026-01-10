// Auth schema
export { account, session, user, verification } from "./auth.schema";
// Common helpers
export { id, pgTable, timestamps } from "./common";
// Posts schema
export { post } from "./posts.schema";
// All relations (consolidated to avoid circular deps)
export {
  accountRelations,
  postRelations,
  sessionRelations,
  userRelations,
} from "./relations";
