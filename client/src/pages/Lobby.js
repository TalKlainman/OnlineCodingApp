import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Lobby.css";
import SERVER_URL from "../config";

function Lobby() {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/codeblocks`)
      .then((response) => setCodeBlocks(response.data))
      .catch((error) => console.error("Error fetching code blocks:", error));
  }, []);

  return (
    <div className="lobby-container">
      <h1>Choose code block</h1>
      <ul className="code-blocks-list">
        {codeBlocks.map((block) => (
          <li key={block._id} className="code-block-item">
            <Link to={`/codeblocks/${block._id}`} className="codeblock-link">{block.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
