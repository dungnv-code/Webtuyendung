import { Editor, Frame, Element } from "@craftjs/core";
import "./introduction.css"

import Avatar from "../../../BlockCV/Avata";
import Experience from "../../../BlockCV/Exp";
import Education from "../../../BlockCV/Education";
import Skills from "../../../BlockCV/Skills";

import Container from "../../../component/Container/Container";
import Sidebar from "../../../component/SidebarCV/SidebarCV";
import SettingsPanel from "../../../component/SettingsPanel/SettingsPanel";

const Introduction = () => {
    return (
        <Editor
            resolver={{
                Container,
                Avatar,
                Experience,
                Education,
                Skills
            }}
        >
            <div className="cv-layout">

                <Sidebar />

                <div className="cv-editor">

                    <Frame>
                        <Element is={Container} canvas>
                            <Avatar />
                            <Experience />
                            <Education />
                            <Skills />
                        </Element>
                    </Frame>

                </div>

                <div className="cv-settings">
                    <SettingsPanel />
                </div>

            </div>
        </Editor>
    );
};

export default Introduction;