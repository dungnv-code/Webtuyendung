import { useNode } from "@craftjs/core";
import { Resizable } from "re-resizable";
const Experience = ({ width = "100%" }) => {
    const {
        connectors: { connect, drag }
    } = useNode();
    return (
        <Resizable
            size={{ width }}
            enable={{ right: true }}
            onResizeStop={(e, direction, ref) => {
                setProp(props => props.width = ref.style.width);
            }}
        >
            <div ref={ref => connect(drag(ref))}>

                <h3>Kinh nghiệm</h3>

                <p>Frontend Developer - ABC Company</p>

            </div>
        </Resizable>
    );
};

Experience.craft = {
    displayName: "Experience",
    props: {
        company: "Công ty ABC",
        role: "Frontend Developer",
        width: "100%",
    }
};

export default Experience;