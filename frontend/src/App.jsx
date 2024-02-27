import React, { useState } from "react";
import "./App.css";
import Login from "./Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [matchingProducts, setMatchingProducts] = useState([]);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please log in first.");
      return;
    }

    if (!message) return;
    setIsTyping(true);
    scrollTo(0, 1e10);

    let msgs = [...chats];
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");
    setMatchingProducts([]); // Clear matching products before fetching new ones

    try {
      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chats: msgs,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        msgs.push(data.output);
        setMatchingProducts(data.matchingProducts);
        setChats(msgs);
        setIsTyping(false);
        scrollTo(0, 1e10);
      } else {
        console.error("Chatbot response error");
      }
    } catch (error) {
      console.error("Chatbot error:", error);
    }
  };

  return (
    <main>
      <div className="app-container">
        {isAuthenticated ? (
          <div className="chat-container">
            {/* Display matching products here */}
            <div className="matching-products">
              <h2>Matching Products:</h2>
              <ul>
                {matchingProducts.map((product, index) => (
                  <li key={index}>
                    <h3>{product.name}</h3>
                    <div className="product-images">
                      {product.images && product.images.length > 0 ? (
                        product.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`${product.name} - Image ${imgIndex}`}
                          />
                        ))
                      ) : (
                        <p>No images available</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Chatbot content */}
            <div className="chatbot-container">
              <h1>AI Fashion Outfit Generator</h1>
              <section>
                {chats && chats.length
                  ? chats.map((chat, index) => (
                      <p key={index} className={`p-${chat.role}`}>
                        <span>
                          <b>{chat.role.toUpperCase()}</b>
                        </span>
                        <span>:</span>
                        <span>{chat.content}</span>
                      </p>
                    ))
                  : ""}
              </section>
              <div className={isTyping ? "" : "hide"}>
                <p>
                  <i>{isTyping ? "Typing" : ""}</i>
                </p>
              </div>
              <form action="" onSubmit={(e) => chat(e, message)}>
                <input
                  type="text"
                  name="message"
                  value={message}
                  placeholder="Type here..."
                  onChange={(e) => setMessage(e.target.value)}
                />
              </form>
            </div>
          </div>
        ) : (
          <Login onLogin={() => setIsAuthenticated(true)} />
        )}
      </div>
    </main>
  );
}

export default App;
