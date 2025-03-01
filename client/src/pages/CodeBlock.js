// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import socket from "../socket";
// import axios from "axios";
// import hljs from "highlight.js";
// import "highlight.js/styles/github-dark.css";
// import "../styles/CodeBlock.css";
// import SERVER_URL from "../config";

// function CodeBlock() {
//   const params = useParams();
//   const navigate = useNavigate();
//   const { id } = params;

//   console.log("Rendering CodeBlock", id);

//   const [title, setTitle] = useState("");
//   const [code, setCode] = useState("");
//   const [solution, setSolution] = useState("");
//   const [isMentor, setIsMentor] = useState(false);
//   const [matchesSolution, setMatchesSolution] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [userCount, setUserCount] = useState(0);

//   useEffect(() => {
//     console.log("useEffect triggered for CodeBlock", id);
//     axios
//       .get(`${SERVER_URL}/codeblocks/${id}`)
//       .then((response) => {
//         setCode(response.data.code);
//         setSolution(response.data.solution);
//         setTitle(response.data.title);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setLoading(false);
//       });
//     // if (socket.currentRoom === id) return;
//     // socket.currentRoom = id;

//     // console.log("Joining room:", id);
//     socket.emit("joinRoom", { roomId: id });

//     socket.on("setMentor", (mentorStatus) => {
//       setIsMentor(mentorStatus);
//       console.log(`Assigned role: ${mentorStatus ? "Mentor" : "Student"}`);
//     });

//     socket.on("updateCode", (newCode) => {
//       console.log("Received new code:", newCode);
//       setCode(newCode);
//     });

//     socket.on("solutionMatch", (matches) => setMatchesSolution(matches));
//     socket.on("userCount", (count) => setUserCount(count));
//     socket.on("mentorLeft", () => navigate("/"));

//     return () => {
//       socket.off("setMentor");
//       socket.off("updateCode");
//       socket.off("solutionMatch");
//       socket.off("userCount");
//       socket.off("mentorLeft");
//       socket.emit("leaveRoom", id);
//       socket.currentRoom = null;
//     };
//   }, [id, navigate]);

//   useEffect(() => {
//     hljs.highlightAll();
//   }, [code]);

//   const handleChange = (event) => {
//     if (isMentor) return;
//     const newCode = event.target.innerText;
//     setCode(newCode);
//     console.log("Emitting code change:", { roomId: id, code: newCode });

//     const matches = newCode.trim() === solution.trim();
//     socket.emit("codeChange", { roomId: id, code: newCode, matches });
//   };

//   return (
//     <div className="code-block-container">
//       {loading ? (
//         <div className="spinner-container">
//           <div className="spinner"></div>
//         </div>
//       ) : (
//         <>
//           <h1>{title}</h1>
//           <p className="user-count">Users in room: {userCount}</p>
//           <h2 className="role-header">
//             {isMentor ? "Mentor (Read-only)" : "Student (Editable)"}
//           </h2>
//           <pre className="codeblock-editor">
//             <code
//               contentEditable={!isMentor}
//               onInput={handleChange}
//               className="code-editor language-javascript"
//             >
//               {code}
//             </code>
//           </pre>
//           <button onClick={() => navigate("/")} className="return-button">
//             Return to Lobby
//           </button>
//           {matchesSolution && (
//             <div className="overlay-smiley">
//               <h1>😊</h1>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
// export default CodeBlock;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
 import "../styles/CodeBlock.css";
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

  // Load data and setup sockets
    useEffect(() => {
    console.log("useEffect triggered for CodeBlock", id);
    axios
      .get(`${SERVER_URL}/codeblocks/${id}`)
      .then((response) => {
        setCode(response.data.code);
        setSolution(response.data.solution);
        setTitle(response.data.title);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
    socket.emit("joinRoom", { roomId: id });

    socket.on("setMentor", (mentorStatus) => {
      setIsMentor(mentorStatus);
      console.log(`Assigned role: ${mentorStatus ? "Mentor" : "Student"}`);
    });

    socket.on("updateCode", (newCode) => {
      console.log("Received new code:", newCode);
      setCode(newCode);
    });

    socket.on("solutionMatch", (matches) => setMatchesSolution(matches));
    socket.on("userCount", (count) => setUserCount(count));
    socket.on("mentorLeft", () => navigate("/"));

    return () => {
      socket.off("setMentor");
      socket.off("updateCode");
      socket.off("solutionMatch");
      socket.off("userCount");
      socket.off("mentorLeft");
      socket.emit("leaveRoom", id);
      socket.currentRoom = null;
    };
  }, [id, navigate]);
  
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
          
          {/* <CodeMirror
            value={code}
            height="300px"
            extensions={[javascript()]}
            onChange={handleChange}
            editable={!isMentor}
            theme="dark"
          /> */}
          
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