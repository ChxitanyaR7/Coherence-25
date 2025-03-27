import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Send, X, Bot, User } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [isLoading, setIsLoading] = useState(false);

  // Reference to the messages container for scrolling
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        text: "Hello! I'm your Hackathon assistant. How can I help you today?",
        sender: "bot",
      },
    ]);
  }, [state]);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    const userInput = input;
    setInput("");

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://amanm10000-mlsc-coherence-25-faq-chatbot-api.hf.space/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: userInput }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let botResponse = data.response;

      // Convert any **bold** text into <strong> tags.
      botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      setMessages((prev) => [
        ...prev,
        { text: botResponse, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          setIsOpen(true);
          const button = document.querySelector(".chat-button");
          if (button) {
            button.style.display = "none";
          }
        }}
        className="fixed z-20 flex justify-center items-center bottom-4 right-4 rounded-full p-4 shadow-lg chat-button scale-75 md:scale-100"
      >
        <Bot className="w-8 h-8" />
      </Button>

      {isOpen && (
        <div
          className="z-50 fixed inset-y-0 right-0  flex items-center p-4 w-full lg:w-1/3 transition-all duration-300 ease-in-out"
        >
          <div className="z-20 relative w-full h-full md:h-auto">
            <Button
              onClick={() => {
                setIsOpen(false);
                const button = document.querySelector(".chat-button");
                if (button) {
                  button.style.display = "flex";
                }
              }}
              className="z-20 absolute -top-2 right-0 md:-top-2 md:-right-2 rounded-full p-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <X className="" />
            </Button>
            <div className="z-20 w-full h-full backdrop-blur-md md:h-auto p-4 rounded-3xl border-2 border-blue-200 bg-blue-200/15">
              <h2 className="text-lg font-bold text-blue-300 mb-4 text-center flex items-center justify-center gap-2">
                <Bot className="w-6 h-6" />
                MLSC Hackathon Assistant
              </h2>
              <Card className="h-3/4 md:h-[calc(100vh-280px)] overflow-y-auto p-2 md:p-4 rounded-3xl border border-blue-100 bg-black/40">
                <CardContent>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 text-md md:text-lg font-medium my-2 rounded-3xl max-w-xs flex items-start text-left gap-2 ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white self-end ml-auto w-3/4 md:w-2/3"
                          : "bg-blue-300 text-blue-900 lg:w-3/4"
                      }`}
                    >
                      {msg.sender === "bot" ? (
                        <Bot className="mt-1 flex-shrink-0 text-sm md:text-lg" />
                      ) : (
                        <User className="mt-1 flex-shrink-0 text-sm md:text-lg" />
                      )}
                      <span
                        dangerouslySetInnerHTML={{ __html: msg.text }} 
                      />
                    </div>
                  ))}
                  {isLoading && (
                    <div className="p-3 text-lg font-medium my-2 rounded-3xl max-w-xs flex items-start gap-2 bg-blue-300 text-green-900">
                      <Bot className="mt-1 flex-shrink-0" />
                      <div className="flex items-center">
                        <span className="dots-loading">..</span>
                        <style jsx>{`
                          .dots-loading:after {
                            content: "...";
                            animation: dots 1.5s steps(5, end) infinite;
                            display: inline-block;
                            width: 0;
                            overflow: hidden;
                            vertical-align: bottom;
                          }
                          @keyframes dots {
                            0%,
                            20% {
                              width: 0;
                            }
                            40% {
                              width: 0.3em;
                            }
                            60% {
                              width: 0.6em;
                            }
                            80%,
                            100% {
                              width: 1em;
                            }
                          }
                        `}</style>
                      </div>
                    </div>
                  )}
                  {/* This is the scroll-to-bottom reference */}
                  <div ref={messagesEndRef} />
                </CardContent>
              </Card>
              <div className="text-lg font-medium flex flex-col gap-2 mt-4">
                <div className="flex gap-2"></div>
                <div className="flex gap-2 text-sm md:text-md">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSend();
                      }
                    }}
                    placeholder="Ask your question here..."
                    className="flex-1 bg-blue-400/35 text-white border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-2xl"
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-blue-600 p-4 hover:bg-green-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}