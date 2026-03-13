import { useNode } from "@craftjs/core";

const Text = ({ text }) => {

    const { connectors: { connect, drag } } = useNode();

    return (
        <p ref={ref => connect(drag(ref))}>
            {text}
        </p>
    );
};

export default Text;