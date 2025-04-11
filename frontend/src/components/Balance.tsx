import { FC, useContext, useEffect, useState } from "react";
import api from "../api";
import { AuthContext } from "../AuthContext";
import { Entry } from "./EntryTable";
import './Balance.css'

type Details = {
    username: string,
    email: string,
    balance: number
}

type BalanceProps = {
    entries: Entry[]
}

const Balance: FC<BalanceProps> = ({ entries }) => {
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
    }, [entries])

    return (
        <>
            <h1>Welcome { details?.username }</h1>
            <h1>Your balance is <span className="balance-text">{ details?.balance }</span> PLN</h1>
        </>
    )
}

export default Balance;