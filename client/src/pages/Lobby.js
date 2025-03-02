/**
 * Lobby component for selecting a code block.
 * Fetches code blocks from the server and navigates to selected ones.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Lobby.css";
import "../styles/App.css";
import SERVER_URL from "../config";

function Lobby() {
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Navigate to the selected code block by its ID.
  const handleCodeBlockClick = (blockId) => {
    navigate(`/codeblocks/${blockId}`);
  };

  // Load code blocks from the server.
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/codeblocks`)
      .then((response) => {
        setCodeBlocks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching code blocks:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="lobby-container">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <h1>Choose code block</h1>
          <ul className="code-blocks-list">
            {codeBlocks.map((block) => (
              <li
                key={block._id}
                className="code-block-item"
                onClick={() => handleCodeBlockClick(block._id)}
              >
                {block.title}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Lobby;
