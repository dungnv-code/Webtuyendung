import { useNode } from "@craftjs/core";

const Education = ({ school, major }) => {

    const {
        connectors: { connect, drag }
    } = useNode();

    return (
        <div
            ref={(ref) => connect(drag(ref))}
            style={{ marginBottom: 20 }}
        >
            <h3>Học vấn</h3>

            <p>
                {major} - {school}
            </p>
        </div>
    );
};

export default Education;

Education.craft = {
    props: {
        school: "ĐH Bách Khoa",
        major: "Công nghệ thông tin"
    }
};