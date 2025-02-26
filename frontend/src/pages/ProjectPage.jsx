import {useParams} from "react-router-dom";

export default function ProjectPage() {
    const {projectId} = useParams();

    return (
        <>
        <h1>{projectId}</h1>
        </>
    );
}