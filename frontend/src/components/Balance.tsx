import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AuthContext } from "../AuthContext";

type Details = {
    username: string,
    email: string,
    balance: number
}

const Balance = () => {
    const [details, setDetails] = useState<Details | null>(null);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<Details>(`details/${userId}`)
                console.log(response);
                setDetails(response.data);
            } catch (error) {
                console.log('API error:', error)
            }
        }

        fetchData();
    })

    return (
        <>
            <h1>Welcome { details?.username }</h1>
            <h1>Your balance is { details?.balance } PLN</h1>
        </>
    )
}

export default Balance;