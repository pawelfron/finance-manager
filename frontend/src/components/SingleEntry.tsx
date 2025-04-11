import { ChangeEventHandler, FC, FormEventHandler, useState } from "react";
import api from "../api";
import { Entry } from "./EntryTable";
import { Category } from "../pages/Categories";

type SingleEntryProps = {
    entry: Entry,
    categories: Category[],
    destroy: (id: number) => Promise<void>
};

const SingleCategory: FC<SingleEntryProps> = ({ entry, categories, destroy }) => {
    const id = entry.id;
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newValue, setNewValue] = useState<Entry>(entry);
    const [currentValue, setCurrentValue] = useState<Entry>(entry);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await api.put(`entries/${id}`, newValue);
            setIsEditing(false);
            setCurrentValue(newValue);
        } catch (error) {
            console.log('API error', error);
        }
    }

    const handleAmountChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        e.preventDefault();

        const value = Number(e.target.value);
        setNewValue({ ...newValue, amount: Math.abs(value), is_expense: value < 0})
    }

    return (
        <tr className="single-entry">
            { isEditing ?
                <>
                    <td>
                        <input id="date" type="date" className="single-category-text-input form-control" value={newValue.date} onChange={e => setNewValue({ ...newValue, date: e.target.value })}/>
                    </td>

                    <td>
                        <input id="name" type="text" className="single-category-text-input form-control" value={newValue.name} onChange={e => setNewValue({ ...newValue, name: e.target.value })}/>
                    </td>

                    <td>
                        <input id="amount" type="number" className="single-category-text-input form-control"
                         value={ (newValue.is_expense ? -1 : 1) * newValue.amount} 
                         onChange={handleAmountChange}/>
                    </td>

                    <td>
                        <select className="form-select" value={newValue.category} onChange={(e) => setNewValue({ ...newValue, category: Number(e.target.value) })}>
                            { categories.map(x => <option key={x.id} value={x.id}>{x.name}</option>) }
                        </select>
                    </td>

                    <td>
                        <input id="place" type="place" className="single-category-text-input form-control" value={newValue.place} onChange={e => setNewValue({ ...newValue, place: e.target.value })}/>
                    </td>


                    <td className="buttons-cell">
                        <button type="submit" className="d-inline-block btn btn-sm btn-primary m-1" onClick={handleSubmit}>OK</button>
                    </td>
                </>:
                <>
                    <td>{ currentValue.date }</td>
                    <td>{ currentValue.name }</td>
                    <td>{ currentValue.is_expense ? '-' : '' } { currentValue.amount }</td>
                    <td>{ categories.find( x => x.id === currentValue.category)?.name }</td>
                    <td>{ currentValue.place }</td>
                    <td className="buttons-cell">
                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>E</button>
                        <button className="btn btn-danger" onClick={() => destroy(id)}>X</button>
                    </td>
                </>
            }
        </tr>
    )
}

export default SingleCategory;