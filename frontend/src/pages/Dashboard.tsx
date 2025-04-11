import { useEffect, useState } from "react";
import EntryTable, { Entry } from "../components/EntryTable";
import NewEntry from "../components/NewEntry";
import api from "../api";
import Balance from "../components/Balance";

const Dashboard = () => {
    const [entries, setEntries] = useState<Entry[]>([]);

    const fetchData = async () => {
        try {
            const response = await api.get<Entry[]>('entries');
            const allEntries = response.data;
            allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setEntries(response.data.slice(0, 10));
        } catch (error) {
            console.log('API error', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const destroyEntry = async (id: number) => {
        try {
            await api.delete(`entries/${id}`)

            fetchData();
        } catch (error) {
            console.log('API error', error);
        }
    }

    return (
        <div className="m-auto w-auto text-center align-middle p-5">
            <div className="row">
                <div className="col">
                    <Balance entries={entries}/>
                </div>
                <div className="col">
                    <NewEntry update={fetchData}/>
                </div>
            </div>
            

            <EntryTable entries={entries} destroyEntry={destroyEntry} />
        </div>
    )
}

export default Dashboard;