import { useState, useRef, useEffect } from "react";
import { chatboxUser } from "../../api/user";
import path from "../../ultils/path";
import { Link } from "react-router-dom";

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
        setMessages(prev => [...prev, { role: "user", text: message }]);
        setLoading(true);
        try {
            const res = await chatboxUser({ message });
            const newMessages = [{ role: "bot", text: res.reply || "Bot không phản hồi" }];
            if (res.jobs?.length > 0) {
                res.jobs.forEach(job => newMessages.push({ role: "job", data: job }));
            }
            setMessages(prev => [...prev, ...newMessages]);
        } catch {
            setMessages(prev => [...prev, { role: "bot", text: `${<i class="fa-solid fa-bug"></i>} Lỗi server, vui lòng thử lại.` }]);
        }
        setLoading(false);
        setMessage("");
    };

    return (
        <>
            <style>{`
                /* ── Pulse ripple ── */
                .chat-fab {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 1050;
                }
                .chat-fab-btn {
                    position: relative;
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    border: none;
                    background: linear-gradient(135deg, #1b5e20, #4caf50);
                    color: #fff;
                    font-size: 1.35rem;
                    cursor: pointer;
                    box-shadow: 0 4px 18px rgba(76,175,80,0.5);
                    transition: transform 0.2s, box-shadow 0.2s;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .chat-fab-btn:hover {
                    transform: scale(1.08);
                    box-shadow: 0 6px 24px rgba(76,175,80,0.6);
                }
                /* Two rings for richer pulse */
                .chat-fab-btn::before,
                .chat-fab-btn::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: rgba(76, 175, 80, 0.45);
                    animation: ripple 2.2s ease-out infinite;
                    z-index: -1;
                }
                .chat-fab-btn::after {
                    animation-delay: 1.1s;
                }
                @keyframes ripple {
                    0%   { transform: scale(1);   opacity: 0.55; }
                    80%  { transform: scale(2.1); opacity: 0;    }
                    100% { transform: scale(2.1); opacity: 0;    }
                }

                .chatbox-window {
                    position: fixed;
                    bottom: 86px;
                    right: 24px;
                    width: 370px;
                    height: 470px;
                    z-index: 1049;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 12px 48px rgba(0,0,0,0.18);
                    display: flex;
                    flex-direction: column;
                    animation: slideUp 0.25s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(18px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }

                .chatbox-header {
                    background: linear-gradient(135deg, #1b5e20, #388e3c);
                    padding: 14px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                }
                .chatbox-header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .chatbox-avatar {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    color: #fff;
                    flex-shrink: 0;
                }
                .chatbox-header-info .title {
                    font-weight: 700;
                    color: #fff;
                    font-size: 0.92rem;
                    line-height: 1.2;
                }
                .chatbox-header-info .subtitle {
                    font-size: 0.72rem;
                    color: rgba(255,255,255,0.75);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .online-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #69f0ae;
                    animation: blink 1.8s infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.3; }
                }
                .chatbox-close-btn {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255,255,255,0.15);
                    color: #fff;
                    font-size: 0.8rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.15s;
                }
                .chatbox-close-btn:hover { background: rgba(255,255,255,0.28); }

                .chatbox-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 14px 12px;
                    background: #f1f8f1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .chatbox-body::-webkit-scrollbar { width: 4px; }
                .chatbox-body::-webkit-scrollbar-thumb { background: #c8e6c9; border-radius: 2px; }
                .bubble-user {
                    align-self: flex-end;
                    background: linear-gradient(135deg, #2e7d32, #4caf50);
                    color: #fff;
                    padding: 9px 14px;
                    border-radius: 18px 18px 4px 18px;
                    max-width: 78%;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    box-shadow: 0 2px 8px rgba(76,175,80,0.25);
                }
                /* Bot bubble */
                .bubble-bot {
                    align-self: flex-start;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    max-width: 88%;
                }
                .bubble-bot-avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #e8f5e9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    flex-shrink: 0;
                    margin-top: 2px;
                    color: #2e7d32;
                }
                .bubble-bot-text {
                    background: #fff;
                    color: #333;
                    padding: 9px 14px;
                    border-radius: 18px 18px 18px 4px;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    border: 1px solid #e8f5e9;
                }
                /* Job card */
                .job-card {
                    align-self: flex-start;
                    background: #fff;
                    border: 1px solid #e8f5e9;
                    border-left: 3px solid #4caf50;
                    border-radius: 10px;
                    padding: 10px 12px;
                    max-width: 90%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    font-size: 0.83rem;
                }
                .job-card-title {
                    font-weight: 700;
                    color: #1b5e20;
                    font-size: 0.88rem;
                    text-decoration: none;
                    display: block;
                    margin-bottom: 5px;
                }
                .job-card-title:hover { text-decoration: underline; }
                .job-card-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .job-card-tag {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #666;
                    font-size: 0.78rem;
                }
                .job-card-tag i { color: #4caf50; }

                /* Typing indicator */
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .typing-dots {
                    display: flex;
                    gap: 4px;
                    background: #fff;
                    padding: 10px 14px;
                    border-radius: 18px 18px 18px 4px;
                    border: 1px solid #e8f5e9;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }
                .typing-dots span {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #a5d6a7;
                    animation: bounce 1.2s infinite;
                }
                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30%            { transform: translateY(-6px); }
                }

                /* ── Footer ── */
                .chatbox-footer {
                    padding: 10px 12px;
                    background: #fff;
                    border-top: 1px solid #e8f5e9;
                    flex-shrink: 0;
                }
                .chatbox-input {
                    border: 1.5px solid #c8e6c9;
                    border-right: none;
                    border-radius: 24px 0 0 24px;
                    padding: 8px 14px;
                    font-size: 0.875rem;
                    outline: none;
                    flex: 1;
                    transition: border-color 0.15s;
                }
                .chatbox-input:focus { border-color: #4caf50; }
                .chatbox-send-btn {
                    background: linear-gradient(135deg, #2e7d32, #4caf50);
                    color: #fff;
                    border: none;
                    border-radius: 0 24px 24px 0;
                    padding: 8px 18px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.15s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .chatbox-send-btn:hover { opacity: 0.88; }
                .chatbox-send-btn:disabled { opacity: 0.55; cursor: not-allowed; }
            `}</style>


            <div className="chat-fab">
                <button className="chat-fab-btn" onClick={() => setOpen(!open)}
                    title="Chat tìm việc">
                    {open
                        ? <i className="fa-solid fa-xmark"></i>
                        : <i className="fa-solid fa-robot"></i>}
                </button>
            </div>
            {open && (
                <div className="chatbox-window">
                    <div className="chatbox-header">
                        <div className="chatbox-header-left">
                            <div className="chatbox-avatar">
                                <i className="fa-solid fa-robot"></i>
                            </div>
                            <div className="chatbox-header-info">
                                <div className="title">Trợ lý tìm việc</div>
                                <div className="subtitle">
                                    <span className="online-dot"></span>
                                    Luôn sẵn sàng hỗ trợ bạn
                                </div>
                            </div>
                        </div>
                        <button className="chatbox-close-btn" onClick={() => setOpen(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div className="chatbox-body">

                        {messages.length === 0 && (
                            <div className="bubble-bot">
                                <div className="bubble-bot-avatar">
                                    <i className="fa-solid fa-robot"></i>
                                </div>
                                <div className="bubble-bot-text">
                                    <i class="fa-regular fa-hand-spock"></i> Xin chào! Mình có thể giúp bạn tìm việc làm phù hợp. Hãy thử hỏi như: <em>"Tìm việc IT tại Hà Nội"</em>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            if (msg.role === "user") return (
                                <div key={index} className="bubble-user">{msg.text}</div>
                            );

                            if (msg.role === "bot") return (
                                <div key={index} className="bubble-bot">
                                    <div className="bubble-bot-avatar">
                                        <i className="fa-solid fa-robot"></i>
                                    </div>
                                    <div className="bubble-bot-text">{msg.text}</div>
                                </div>
                            );

                            if (msg.role === "job") {
                                const job = msg.data;
                                return (
                                    <div key={index} className="job-card">
                                        <Link to={`${path.JOB}/${job._id}`} className="job-card-title">
                                            {job.title}
                                        </Link>
                                        <div className="job-card-meta">
                                            <span className="job-card-tag">
                                                <i className="fa-solid fa-location-dot"></i>{job.location}
                                            </span>
                                            <span className="job-card-tag">
                                                <i className="fa-solid fa-building"></i>{job.joblevel}
                                            </span>
                                            <span className="job-card-tag">
                                                <i className="fa-regular fa-calendar"></i>
                                                {new Date(job.deadline).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}


                        {loading && (
                            <div className="typing-indicator">
                                <div className="bubble-bot-avatar">
                                    <i className="fa-solid fa-robot"></i>
                                </div>
                                <div className="typing-dots">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>


                    <div className="chatbox-footer">
                        <div className="d-flex">
                            <input
                                type="text"
                                className="chatbox-input"
                                placeholder="Hỏi về việc làm..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && sendMessage()}
                            />
                            <button className="chatbox-send-btn" onClick={sendMessage} disabled={loading || !message.trim()}>
                                <i className="fa-solid fa-paper-plane"></i>
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
