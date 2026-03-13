import { useNode } from "@craftjs/core";

const Container = ({ children }) => {

    const {
        connectors: { connect }
    } = useNode();

    return (
        <div
            ref={connect}
            style={{
                minHeight: "1000px",
                padding: "40px",
                background: "#fff",
                maxWidth: "850px",
                width: "100%",
                margin: "0 auto",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                borderRadius: "6px"
            }}
        >
            {children}
        </div>
    );
};

Container.craft = {
    displayName: "Container"
};

export default Container;