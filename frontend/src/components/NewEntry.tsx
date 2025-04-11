import { ChangeEventHandler, FC, FormEventHandler, useEffect, useState } from "react";
import { Category } from "../pages/Categories";
import api from "../api";

type NewEntryProps = {
    update: () => Promise<void>;
}

const NewEntry: FC<NewEntryProps> = ({ update }) => {
    const [name, setName] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [place, setPlace] = useState<string>('');
    const [isExpense, setIsExpense] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await api.post('entries', {
                name, date, amount, place, is_expense: isExpense, category: selectedCategory
            });

            update();
        } catch (error) {
            console.log('API error', error);
        }
    }

    const handleCategoryChange: ChangeEventHandler<HTMLSelectElement> = async (e) => {
        setSelectedCategory(Number(e.target.value));
    };

    const handleIsExpenseChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        setIsExpense(e.target.checked);
    };

    return (
        <form className="new-category-form mx-auto mb-3" onSubmit={handleSubmit}>
            <h3>Create new entry:</h3>
            <div className="m-1">
                <div className="row align-items-center my-2">
                    <div className="col-8">
                        <input id="name" type="text" className="form-control" value={name} placeholder="Name" onChange={e => setName(e.target.value)}/>
                    </div>

                    <div className="col-4">
                        <select className="form-select" value={selectedCategory ?? ''} onChange={handleCategoryChange}>
                            <option value="">Category</option>
                            { categories.map(x => <option key={x.id} value={x.id}>{x.name}</option>) }
                        </select>
                    </div>
                </div>



                <div className="row align-items-center my-2">
                    <div className="col">
                        <input id="date" type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)}/>
                    </div>

                    <div className="col">
                        <input id="place" type="text" className="form-control" value={place} placeholder="Place" onChange={e => setPlace(e.target.value)}/>
                    </div>
                </div>

                <div className="row align-items-center my-2">
                    <div className="col-4 form-check">
                        <label htmlFor="is-expense" className="form-check-label">Is expense*</label>
                        <input id="is-expense" type="checkbox" className="form-check-input" checked={isExpense} onChange={handleIsExpenseChange}/>
                    </div>

                    <div className="col">
                        <input id="amount" type="number" placeholder="Amount" className="form-control" value={amount} onChange={e => setAmount(e.target.value)}/>
                    </div>

                </div>

                <input type="submit" value="Create" className="btn btn-primary m-1"/>
                
                <h6>Check if it's an expense, uncheck if income</h6>
            </div>
        </form>
    );
}

export default NewEntry;