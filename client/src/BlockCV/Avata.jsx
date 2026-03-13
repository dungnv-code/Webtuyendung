import { useNode } from "@craftjs/core";

const Avatar = ({ url }) => {

    const {
        connectors: { connect, drag },
        actions: { setProp }
    } = useNode();

    const handleUpload = (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            setProp((props) => {
                props.url = event.target.result;
            });
        };

        reader.readAsDataURL(file);
    };

    const removeAvatar = () => {
        setProp((props) => {
            props.url = "";
        });
    };

    return (
        <div
            ref={(ref) => connect(drag(ref))}
            style={{ textAlign: "center", marginBottom: 20 }}
        >

            <img
                src={url || "https://i.pravatar.cc/150"}
                style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover"
                }}
            />

            <div style={{ marginTop: 10 }}>

                <input
                    type="file"
                    onChange={handleUpload}
                />

                <button
                    onClick={removeAvatar}
                    style={{ marginLeft: 10 }}
                >
                    Xoá
                </button>

            </div>

        </div>
    );
};

Avatar.craft = {
    displayName: "Avatar",
    props: {
        url: ""
    }
};

export default Avatar;