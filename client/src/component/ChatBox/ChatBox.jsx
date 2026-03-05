import { useState, useRef, useEffect } from "react";
import { chatboxUser } from "../../api/user";
import path from "../../ultils/path"
import { Link } from "react-router-dom"
const ChatBox = () => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {

        if (!message.trim()) return;

        const userMessage = {
            role: "user",
            text: message
        };

        setMessages(prev => [...prev, userMessage]);

        setLoading(true);

        try {

            const res = await chatboxUser({ message });
            const newMessages = [
                {
                    role: "bot",
                    text: res.reply || "Bot không phản hồi"
                }
            ];

            if (res.jobs && res.jobs.length > 0) {

                res.jobs.forEach(job => {
                    newMessages.push({
                        role: "job",
                        data: job
                    });
                });

            }

            setMessages(prev => [...prev, ...newMessages]);

        } catch (error) {

            setMessages(prev => [
                ...prev,
                { role: "bot", text: "⚠️ Lỗi server" }
            ]);

        }

        setLoading(false);
        setMessage("");
    };

    return (
        <>

            {/* BUTTON */}
            <div
                style={{
                    position: "fixed",
                    bottom: "5%",
                    right: "5%",
                    zIndex: 1000
                }}
            >
                <div
                    className="bg-info"
                    onClick={() => setOpen(!open)}
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                    }}
                >
                    <i className="fa-solid fa-robot" style={{ fontSize: "28px" }}></i>
                </div>
            </div>

            {/* CHATBOX */}

            {open && (

                <div
                    style={{
                        position: "fixed",
                        bottom: "100px",
                        right: "5%",
                        width: "360px",
                        height: "470px",
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1000
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            background: "#0dcaf0",
                            color: "#fff",
                            padding: "10px",
                            fontWeight: "bold"
                        }}
                    >
                        🤖 AI Tìm Việc
                    </div>

                    {/* MESSAGES */}

                    <div
                        style={{
                            flex: 1,
                            padding: "10px",
                            overflowY: "auto"
                        }}
                    >

                        {messages.map((msg, index) => {

                            // USER

                            if (msg.role === "user") {

                                return (
                                    <div key={index} style={{ textAlign: "right", marginBottom: "10px" }}>
                                        <span
                                            style={{
                                                background: "#0dcaf0",
                                                color: "#fff",
                                                padding: "6px 10px",
                                                borderRadius: "10px"
                                            }}
                                        >
                                            {msg.text}
                                        </span>
                                    </div>
                                );

                            }

                            // BOT

                            if (msg.role === "bot") {

                                return (
                                    <div key={index} style={{ marginBottom: "10px" }}>
                                        <span
                                            style={{
                                                background: "#eee",
                                                padding: "6px 10px",
                                                borderRadius: "10px"
                                            }}
                                        >
                                            {msg.text}
                                        </span>
                                    </div>
                                );

                            }

                            if (msg.role === "job") {

                                const job = msg.data;

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            padding: "10px",
                                            marginBottom: "10px",
                                            background: "#f8f9fa"
                                        }}
                                    >

                                        <Link to={`${path.JOB}/${job._id}`}><b>{job.title}</b></Link>

                                        <p>📍 {job.location}</p>

                                        <p>👀 {job.view} lượt xem</p>

                                        <p>
                                            📅 {new Date(job.deadline).toLocaleDateString()}
                                        </p>

                                    </div>
                                );

                            }

                            return null;

                        })}

                        {loading && (
                            <p>🤖 AI đang trả lời...</p>
                        )}

                        <div ref={bottomRef}></div>

                    </div>

                    {/* INPUT */}

                    <div
                        style={{
                            display: "flex",
                            borderTop: "1px solid #ddd"
                        }}
                    >

                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                            placeholder="Nhập câu hỏi..."
                            style={{
                                flex: 1,
                                border: "none",
                                padding: "10px"
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            style={{
                                border: "none",
                                background: "#0dcaf0",
                                color: "#fff",
                                padding: "10px 15px"
                            }}
                        >
                            Gửi
                        </button>

                    </div>

                </div>

            )}

        </>
    );
};

export default ChatBox;