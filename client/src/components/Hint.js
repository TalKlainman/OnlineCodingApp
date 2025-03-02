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
      socket.off("showHint");
    };
  }, []);

  // Function to send hints to students
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
