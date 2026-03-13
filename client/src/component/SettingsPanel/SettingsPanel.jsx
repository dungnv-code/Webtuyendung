import { useEditor } from "@craftjs/core";
import React from "react";

const SettingsPanel = () => {
    const { selected, actions } = useEditor((state) => {
        const [nodeId] = state.events.selected; // state.events.selected thường là một Set

        if (!nodeId || !state.nodes[nodeId]) {
            return { selected: null };
        }

        return {
            selected: {
                id: nodeId,
                name: state.nodes[nodeId].data.displayName || state.nodes[nodeId].data.name,
                props: state.nodes[nodeId].data.props,
            },
        };
    });

    if (!selected) {
        return (
            <div style={{ padding: 20, color: "#666" }}>
                <i>Chọn một thành phần trên Canvas để chỉnh sửa</i>
            </div>
        );
    }

    const handleDelete = () => {
        if (selected.id === "ROOT") {
            alert("Không thể xoá khung nền chính!");
            return;
        }
        actions.delete(selected.id);
    };

    return (
        <div style={{ padding: 20 }}>
            <h3 style={{ borderBottom: "1px solid #ddd", pb: 10 }}>
                Thiết lập: {selected.name}
            </h3>

            <div style={{ marginTop: 20 }}>
                {Object.entries(selected.props || {}).map(([key, value]) => {
                    if (key === "children" || key === "isCanvas") return null;
                    return (
                        <div key={key} style={{ marginBottom: 15 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: "bold", marginBottom: 5, textTransform: "capitalize" }}>
                                {key}
                            </label>

                            <input
                                value={value}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    actions.setProp(selected.id, (props) => {

                                        if (key === "skills") {
                                            props[key] = val.split(",").map(s => s.trim());
                                        } else {
                                            props[key] = val;
                                        }
                                    });
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            <button
                style={{
                    marginTop: 30,
                    background: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: "bold"
                }}
                onClick={handleDelete}
                disabled={selected.id === "ROOT"}
            >
                Xoá Thành Phần
            </button>
        </div>
    );
};

export default SettingsPanel;