import { useEffect, useState } from "react";

const TripCard = ({ trip }) => {
    const [requirement, setRequirement] = useState({});
    const { requirementsId } = trip;
    console.log(requirementsId);

    useEffect(() => {
        fetch(`http://localhost:3500/requirements/get-requirements/${requirementsId}`)
            .then(res => res.json())
            .then(data => setRequirement(data));
    }, [trip])

    console.log(requirement);
    return (
        <div>
            <Link>

            </Link>
        </div>
    );
};

export default TripCard;