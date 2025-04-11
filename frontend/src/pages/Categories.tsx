import { FormEventHandler, useEffect, useState } from "react";
import api from "../api";
import './Categories.css'
import SingleCategory from "../components/SingleCategory";

export type Category = {
    id: number,
    name: string
};

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [newName, setNewName] = useState<string>('');

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
            await api.post('categories', { name: newName });

            const response = await api.get<Category[]>('categories');
            setCategories(response.data);
        } catch (error) {
            console.log('API error', error);
        }
    }

    const destroyCategory = async (id: number) => {
        try {
            await api.delete(`categories/${id}`);

            const response = await api.get<Category[]>('categories');
            setCategories(response.data);
        } catch (error) {
            console.log('API error', error);
        }    
    }

    return (
        <>
            <form className="new-category-form mx-auto" onSubmit={handleSubmit}>
                <h3>Create new category:</h3>
                <div className="m-1">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input id="name" type="text" className="form-control" value={newName} placeholder="Name" onChange={e => setNewName(e.target.value)}/>

                    <input type="submit" value="Create" className="btn btn-primary m-1"/>
                </div>
            </form>
            <div className="fs-1 m-auto w-auto text-center align-middle p-5">
                {categories.map((x) => <SingleCategory key={x.id} id={x.id} name={x.name} destroy={destroyCategory} />)}
            </div>
        </>
    )
}

export default Categories;