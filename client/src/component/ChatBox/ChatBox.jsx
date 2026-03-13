import { useState, useRef, useEffect } from "react";
import { chatboxUser } from "../../api/user";
import path from "../../ultils/path";
import { Link } from "react-router-dom";
import "/Chatbox.css"
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

            <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
                <button
                    className="btn btn-info rounded-circle shadow chat-btn"
                    style={{ width: "60px", height: "60px" }}
                    onClick={() => setOpen(!open)}
                >
                    <i className="fa-solid fa-robot fs-4"></i>
                </button>
            </div>

            {/* CHATBOX */}

            {open && (

                <div
                    className="card shadow-lg position-fixed bottom-0 end-0 m-4"
                    style={{
                        width: "380px",
                        height: "500px",
                        zIndex: 1000
                    }}
                >
                    <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">

                        <span className="d-flex align-items-center gap-2">
                            <i class="fa-brands fa-bots" style={{ fontSize: "45px" }}></i> tìm việc
                        </span>

                        <button
                            className="btn btn-sm btn-light"
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>

                    </div>


                    <div
                        className="card-body overflow-auto"
                        style={{ background: "#f8f9fa" }}
                    >

                        {messages.map((msg, index) => {

                            if (msg.role === "user") {

                                return (
                                    <div key={index} className="d-flex justify-content-end mb-2">

                                        <div className="bg-info text-white px-3 py-2 rounded">
                                            {msg.text}
                                        </div>

                                    </div>
                                );

                            }

                            if (msg.role === "bot") {

                                return (
                                    <div key={index} className="d-flex mb-2">

                                        <div className="bg-white border px-3 py-2 rounded shadow-sm">
                                            {msg.text}
                                        </div>

                                    </div>
                                );

                            }

                            if (msg.role === "job") {

                                const job = msg.data;

                                return (

                                    <div key={index} className="card mb-2 border-0 shadow-sm">

                                        <div className="card-body p-2">

                                            <Link
                                                to={`${path.JOB}/${job._id}`}
                                                className="fw-bold text-decoration-none"
                                            >
                                                {job.title}
                                            </Link>

                                            <div className="small text-muted">

                                                <div>📍 {job.location}</div>

                                                <div>
                                                    👔 {job.joblevel}
                                                </div>

                                                <div>
                                                    📅 {new Date(job.deadline).toLocaleDateString()}
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }

                            return null;

                        })}

                        {loading && (
                            <div className="text-muted small d-flex align-items-center gap-3">
                                <i class="fa-brands fa-bots" style={{ fontSize: "35px" }}></i> đang trả lời...
                            </div>
                        )}

                        <div ref={bottomRef}></div>

                    </div>

                    <div className="card-footer">

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Hỏi về việc làm..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                            />

                            <button
                                className="btn btn-info text-white"
                                onClick={sendMessage}
                            >
                                Gửi
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
};

export default ChatBox;