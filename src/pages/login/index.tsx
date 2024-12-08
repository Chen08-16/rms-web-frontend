import { AuthPage } from "@refinedev/antd";
import R_Wallpaper_2 from '../../images/R_Wallpaper_2.jpg';

export const Login = () => {
    return (
        <div 
            className="login-page" 
            style={{
                backgroundImage: `url(${R_Wallpaper_2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '800px',
                marginTop: '200px',
                marginBottom: '200px'
            }}>
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
        </div>
    );
};