import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import "../styles/CodeBlock.css";
import "../styles/GetHint.css";
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
  const [hint, setHint] = useState(""); // Store the hint content
  const [showHint, setShowHint] = useState(false); // Control hint visibility

  // Load data and setup sockets
  useEffect(() => {
    socket.on("setMentor", (mentorStatus) => {
      setIsMentor(mentorStatus);
    });

    // Regular code updates from other users
    socket.on("updateCode", (newCode) => {
      setCode(newCode);
    });

    // Initial state when joining a room
    socket.on("initialState", (state) => {
      setCode(state.code);
      setMatchesSolution(state.matches);
    });

    // Listen for hint broadcasts from the mentor
    socket.on("showHint", (hintText) => {
      setHint(hintText);
      setShowHint(true);
    });

    socket.on("solutionMatch", (matches) => setMatchesSolution(matches));
    socket.on("userCount", (count) => setUserCount(count));
    socket.on("mentorLeft", () => navigate("/"));

    socket.emit("joinRoom", { roomId: id });

    // Then fetch data from the database
    axios
      .get(`${SERVER_URL}/codeblocks/${id}`)
      .then((response) => {
        // Only set code from database if we haven't received it from socket yet
        // This way the server state takes precedence
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
      socket.off("setMentor");
      socket.off("updateCode");
      socket.off("solutionMatch");
      socket.off("userCount");
      socket.off("mentorLeft");
      socket.off("showHint");
      socket.emit("leaveRoom", id);
      socket.off("initialState");
      socket.currentRoom = null;
    };
  }, [id, navigate]);

  const handleChange = (newCode) => {
    if (isMentor) return;

    setCode(newCode);
    const matches = newCode.trim() === solution.trim();
    socket.emit("codeChange", { roomId: id, code: newCode, matches });
  };

  // Mentor function to send hint to all students
  const sendHintToStudents = () => {
    socket.emit("sendHint", { roomId: id, hint });
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

          {isMentor && (
            <div className="flex-center">
              <button onClick={sendHintToStudents} className="send-hint-button">
                Send Hint to Students
              </button>
            </div>
          )}

          {!isMentor && showHint && (
            <div className="flex-center">
              <div className="hint-box">
                <p>Hint : {hint}</p>
              </div>
            </div>
          )}

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
