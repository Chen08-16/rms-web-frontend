import { AuthPage } from "@refinedev/antd";

export const Login = () => {
    return (
        <div className="login-page">
            <AuthPage
                type="login"
                providers={[
                    {
                        name: "google",
                        label: "Sign in with Google",
                    },
                ]}
            />
        </div>
    );
};