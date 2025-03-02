/**
 * Configures and exports a Socket.IO client instance.
 * Connects to the backend server using WebSocket transport.
 * 
 * @module socket
 */

import { io } from "socket.io-client";
import SERVER_URL from "./config";

const socket = io(`${SERVER_URL}`, {
  transports: ["websocket"],
});

export default socket;
