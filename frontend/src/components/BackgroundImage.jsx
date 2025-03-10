import backgroundImage from './../assets/black_sky.jpg';
import {useEffect} from "react";

export default function BackgroundImage({ children }) {

    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Отключаем прокрутку
        return () => {
            document.body.style.overflow = 'visible'; // Восстанавливаем прокрутку при размонтировании
        };
    }, []);

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {children}
        </div>
    );
}