import "./loading.css"

const Loading = () => {
    return (
        <>
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    width: "100%",
                    height: "100%",
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <span
                    className="spinner-border text-light"
                    role="status"
                    style={{
                        width: "4rem",
                        height: "4rem",
                        borderWidth: "6px",
                        animation: "spin .8s linear infinite"
                    }}
                ></span>

                <span
                    style={{
                        marginTop: "15px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        letterSpacing: "2px",
                        animation: "pulse 1.5s infinite",
                        color: "#fff"
                    }}
                >
                    Loading...
                </span>
            </div>
        </>
    );
};

export default Loading;