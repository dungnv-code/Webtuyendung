import { useEffect } from "react";
import { useSelector } from "react-redux";
const Login = () => {
    const skill = useSelector(state => state.app.skill);
    useEffect(() => {
        console.log("Skills:", skill);
    }, [skill]);
    return (
        <div className="login">
            <h1>Welcome to the Login Page</h1>
        </div>
    );
}

export default Login;