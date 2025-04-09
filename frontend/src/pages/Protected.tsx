import { useEffect, useState } from "react";
import api from "../api";

type Entry = {
    name: string;
    date: string;
    category: number;
    amount: number;
    place: string;
    is_expense: boolean;
}

const Protected = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('entries');
                setEntries(data);
            } catch (error) {
                console.log('error');
            }
        }
        
        fetchData();
    }, [])
    return (
        <>
            {entries.map((x) => x.name)}
        </>
    )
}

export default Protected;