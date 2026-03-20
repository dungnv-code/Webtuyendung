import { wishlistbusiness } from "../../../api/user";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";
import { useState, useEffect } from "react";

const WishlistBusiness = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await wishlistbusiness();
                setData(res.data || []);
            } catch (error) {
                console.log("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .wb-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 60%, #f0fdf4 100%);
                    padding: 3rem 1rem;
                    font-family: 'Inter', sans-serif;
                }

                .wb-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .wb-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 2.5rem;
                }

                /* ── Grid ── */
                .wb-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.25rem;
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ── Card ── */
                .wb-card {
                    background: #fff;
                    border-radius: 18px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.06);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.22s, box-shadow 0.22s;
                    position: relative;
                }

                .wb-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 14px 36px rgba(99,102,241,0.13);
                }

                /* ── Cover ── */
                .wb-cover-wrap {
                    position: relative;
                    height: 100px;
                    overflow: hidden;
                }

                .wb-cover {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.4s;
                }

                .wb-card:hover .wb-cover { transform: scale(1.05); }

                /* gradient fade over cover */
                .wb-cover-wrap::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.55));
                }

                /* ── Body ── */
                .wb-body {
                    padding: 0 1.2rem 1.2rem;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                /* ── Avatar row ── */
                .wb-avatar-row {
                    display: flex;
                    align-items: flex-end;
                    gap: 0.85rem;
                    margin-top: -28px;
                    margin-bottom: 0.75rem;
                    position: relative;
                    z-index: 1;
                }

                .wb-avatar {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    object-fit: cover;
                    border: 3px solid #fff;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    flex-shrink: 0;
                    background: #f3f4f6;
                }

                .wb-name-block {
                    padding-bottom: 2px;
                }

                .wb-name {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.92rem;
                    font-weight: 600;
                    color: #1e1b4b;
                    text-decoration: none;
                    display: block;
                    line-height: 1.3;
                    transition: color 0.2s;
                }

                .wb-name:hover { color: #6366f1; }

                .wb-field {
                    font-size: 0.75rem;
                    color: #6366f1;
                    font-weight: 500;
                    margin-top: 0.15rem;
                }

                /* ── Divider ── */
                .wb-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 0.6rem 0 0.75rem;
                }

                /* ── Meta chips ── */
                .wb-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .wb-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.45rem;
                    font-size: 0.76rem;
                    color: #6b7280;
                    background: #f9fafb;
                    border-radius: 999px;
                    padding: 0.22rem 0.7rem;
                    width: fit-content;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .wb-chip i {
                    color: #a5b4fc;
                    font-size: 0.7rem;
                    flex-shrink: 0;
                }

                /* ── Loading ── */
                .wb-loading {
                    text-align: center;
                    padding: 5rem 0;
                    color: #6366f1;
                }

                .wb-spinner {
                    width: 36px;
                    height: 36px;
                    border: 3px solid #e0e7ff;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: wbspin 0.8s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes wbspin { to { transform: rotate(360deg); } }

                /* ── Empty ── */
                .wb-empty {
                    text-align: center;
                    color: #9ca3af;
                    padding: 4rem 0;
                    grid-column: 1 / -1;
                }

                .wb-empty i {
                    font-size: 2.5rem;
                    display: block;
                    margin-bottom: 0.75rem;
                    color: #d1d5db;
                }
            `}</style>

            <div className="wb-page">
                <h2 className="wb-heading">Doanh nghiệp theo dõi</h2>
                <p className="wb-sub">Danh sách công ty bạn đang quan tâm</p>

                {loading ? (
                    <div className="wb-loading">
                        <div className="wb-spinner" />
                        <p style={{ fontSize: "0.85rem" }}>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="wb-grid">
                        {data.length === 0 ? (
                            <div className="wb-empty">
                                <i className="fa-regular fa-bookmark" />
                                <p>Chưa có doanh nghiệp nào được lưu.</p>
                            </div>
                        ) : (
                            data.map((biz) => (
                                <div className="wb-card" key={biz._id}>
                                    {/* Cover */}
                                    <div className="wb-cover-wrap">
                                        <img src={biz.imageCoverBusiness} className="wb-cover" alt="cover" />
                                    </div>

                                    <div className="wb-body">
                                        {/* Avatar + Name */}
                                        <div className="wb-avatar-row">
                                            <img src={biz.imageAvatarBusiness} className="wb-avatar" alt="avatar" />
                                            <div className="wb-name-block">
                                                <Link to={`${path.COMPANY}/${biz._id}`} className="wb-name">
                                                    {biz.nameBusiness}
                                                </Link>
                                                <p className="wb-field">{biz.FieldBusiness}</p>
                                            </div>
                                        </div>

                                        <hr className="wb-divider" />

                                        {/* Meta */}
                                        <div className="wb-meta">
                                            <span className="wb-chip">
                                                <i className="fa-solid fa-users" />
                                                {biz.numberOfEmployees} nhân viên
                                            </span>
                                            <span className="wb-chip">
                                                <i className="fa-solid fa-location-dot" />
                                                {biz.addressBusiness}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default WishlistBusiness;
