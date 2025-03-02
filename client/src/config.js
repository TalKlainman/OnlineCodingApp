/**
 * Configuration file for server URL.
 * Uses environment variable if available, otherwise defaults to localhost.
 *
 * @module config
 */

const SERVER_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default SERVER_URL;
