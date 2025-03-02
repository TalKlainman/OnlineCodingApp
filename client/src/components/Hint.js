/**
 * Hints component for displaying and sending hints.
 * Mentors can send hints to students.
 */

import "../styles/Hint.css";
import { useEffect, useState } from "react";
import socket from "../socket";

function Hints({ roomId, isMentor, initialHint }) {
  const [hint, setHint] = useState(
    initialHint || "No hint available for this challenge."
  );
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Listen for hints broadcasted by the mentor
    socket.on("showHint", (hintText) => {
      setHint(hintText);
      setShowHint(true);
    });

    return () => {
      // Remove hint listener when leaving the page
      socket.off("showHint");
    };
  }, []);

  // Sends the hint to all students in the room
  const sendHintToStudents = () => {
    socket.emit("sendHint", { roomId, hint });
  };

  return (
    <div>
      {isMentor ? (
        <div className="flex-center">
          <button onClick={sendHintToStudents} className="send-hint-button">
            Send Hint to Students
          </button>
        </div>
      ) : (
        showHint && (
          <div className="flex-center">
            <div className="hint-box">
              <p>Hint: {hint}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Hints;
