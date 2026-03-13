import { useEditor } from "@craftjs/core";

import Avatar from "../../BlockCV/Avata";
import Experience from "../../BlockCV/Exp";
import Education from "../../BlockCV/Education";
import Skills from "../../BlockCV/Skills";

const Sidebar = () => {

    const { connectors } = useEditor();

    return (
        <div
            style={{
                width: 220,
                borderRight: "1px solid #ddd",
                padding: 20
            }}
        >

            <h3>Blocks</h3>

            <div
                ref={(ref) => connectors.create(ref, <Avatar />)}
                style={{ marginBottom: 10, cursor: "pointer" }}
            >
                Avatar
            </div>

            <div
                ref={(ref) => connectors.create(ref, <Experience />)}
                style={{ marginBottom: 10, cursor: "pointer" }}
            >
                Experience
            </div>

            <div
                ref={(ref) => connectors.create(ref, <Education />)}
                style={{ marginBottom: 10, cursor: "pointer" }}
            >
                Education
            </div>

            <div
                ref={(ref) => connectors.create(ref, <Skills />)}
                style={{ marginBottom: 10, cursor: "pointer" }}
            >
                Skills
            </div>

        </div>
    );
};

export default Sidebar;