import {useParams} from "react-router-dom";

export default function ProfilePage() {
    const {username} = useParams()

    return (
        <>
        <h1>{username}</h1>
        </>
    );
}