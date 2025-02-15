/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(`/*Paste Your Code Here*/
  function sum() {
  return 1 + 1;
  }`);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setIsLoading(true); // Show loading state
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (error) {
      setReview("Error fetching review. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  }

  return (
    <>
      <h1 className="title">Your Personal Code Reviewer</h1>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                minHeight: "300px",
                width: "100%",
                overflow: "auto",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            {isLoading ? "Processing..." : "Review"}
          </div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {isLoading ? "_Analyzing your code... Please wait._" : review}
          </Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
