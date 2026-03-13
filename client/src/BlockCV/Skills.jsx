import { useNode } from "@craftjs/core";

// Khai báo giá trị mặc định cho skills là []
const Skills = ({ skills = [] }) => {
    const {
        connectors: { connect, drag }
    } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref))} style={{ padding: '10px' }}>
            <h3>Kỹ năng</h3>
            <ul>
                {/* Kiểm tra kỹ trước khi map để tránh crash */}
                {Array.isArray(skills) && skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
        </div>
    );
};

// QUAN TRỌNG: Định nghĩa craft config để SettingsPanel nhận diện được
Skills.craft = {
    displayName: "Skills",
    props: {
        skills: ["React", "JavaScript", "CSS"] // Giá trị khởi tạo
    }
};

export default Skills;