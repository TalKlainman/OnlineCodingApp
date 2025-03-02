/**
 * CodeBlock component for solving coding challenges.
 * Fetches challenge data, synchronizes code edits via WebSockets,
 * and provides real-time collaboration features.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import "../styles/CodeBlock.css";
import Hints from "../components/Hint";
import "../styles/App.css";
import SERVER_URL from "../config";

function CodeBlock() {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [solution, setSolution] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [matchesSolution, setMatchesSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [hint, setHint] = useState("");

  useEffect(() => {
    // Listen for updates from other users
    socket.on("updateCode", (newCode) => setCode(newCode));
    socket.on("setMentor", (mentorStatus) => setIsMentor(mentorStatus));
    socket.on("solutionMatch", (matches) => setMatchesSolution(matches));
    socket.on("userCount", (count) => setUserCount(count));
    socket.on("mentorLeft", () => navigate("/"));

    // Load initial state when joining a room
    socket.on("initialState", (state) => {
      if (state && state.code) {
        setCode(state.code);
        setMatchesSolution(state.matches);
      }
    });

    socket.emit("joinRoom", { roomId: id });

    // Fetch challenge data from the server
    axios
      .get(`${SERVER_URL}/codeblocks/${id}`)
      .then((response) => {
        setCode((prevCode) => prevCode || response.data.code);
        setSolution(response.data.solution);
        setTitle(response.data.title);
        setHint(response.data.hint || "No hint available for this challenge.");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });

    return () => {
      // Remove event listeners when leaving the page
      socket.off("setMentor");
      socket.off("updateCode");
      socket.off("solutionMatch");
      socket.off("userCount");
      socket.off("mentorLeft");
      socket.emit("leaveRoom", id);
      socket.off("initialState");
      socket.currentRoom = null;
    };
  }, [id, navigate]);

  // Updates code in real-time and syncs changes with the server.
  const handleChange = (newCode) => {
    if (isMentor) return;

    setCode(newCode);
    const matches = newCode.trim() === solution.trim();
    socket.emit("codeChange", { roomId: id, code: newCode, matches });
  };

  return (
    <div className="code-block-container">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <h1>{title}</h1>
          <p className="user-count">Users in room: {userCount}</p>
          <h2 className="role-header">
            {isMentor ? "Mentor (Read-only)" : "Student (Editable)"}
          </h2>
          <Hints roomId={id} isMentor={isMentor} initialHint={hint} />
          <div className="codeblock-editor">
            <CodeMirror
              className="code-editor"
              value={code}
              height="300px"
              extensions={[javascript()]}
              onChange={handleChange}
              editable={!isMentor}
              theme="dark"
            />
          </div>
          <button onClick={() => navigate("/")} className="return-button">
            Return to Lobby
          </button>
          {matchesSolution && (
            <div className="overlay-smiley">
              <h1>😊</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CodeBlock;
