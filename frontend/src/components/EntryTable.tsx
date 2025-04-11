import { FC, useEffect, useState } from "react";
import { Category } from "../pages/Categories";
import api from "../api";
import SingleEntry from "./SingleEntry";
import './EntryTable.css'

export type Entry = {
    id: number;
    name: string;
    date: string;
    category: number;
    amount: number;
    place: string;
    is_expense: boolean;
}

type EntryTableProps = {
    entries: Entry[],
    destroyEntry: (id: number) => Promise<void>
}

const EntryTable: FC<EntryTableProps> = ({ entries, destroyEntry }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<Category[]>('categories');
                setCategories(response.data);
            } catch (error) {
                console.log('API error', error);
            }
        }

        fetchData();
    }, []);

    return (
        <table className="entry-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Place</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {entries.map(x => <SingleEntry key={x.id} entry={x} categories={categories} destroy={destroyEntry} />)}
            </tbody>
        </table>
    )
}

export default EntryTable;