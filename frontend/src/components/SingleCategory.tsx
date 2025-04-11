import { FC, FormEventHandler, useState } from "react";
import './SingleCategory.css'
import api from "../api";

type SingleCategoryProps = {
    id: number,
    name: string,
    destroy: (id: number) => Promise<void>
};

const SingleCategory: FC<SingleCategoryProps> = ({ id, name, destroy }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>(name);
    const [currentName, setCurrentName] = useState<string>(name);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await api.put(`categories/${id}`, { name: newName });
            setIsEditing(false);
            setCurrentName(newName);
        } catch (error) {
            console.log('API error', error);
        }
    }

    return (
        <div className="single-category">
            { isEditing ?
                <form onSubmit={handleSubmit}>
                    <input id="name" type="text" className="single-category-text-input form-control" value={newName} placeholder="Name" onChange={e => setNewName(e.target.value)}/>

                    <input type="submit" value="Update" className="d-inline-block btn btn-sm btn-primary m-1"/>
                </form>:
                <>
                    { currentName }
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>E</button>
                    <button className="btn btn-danger" onClick={() => destroy(id)}>X</button>
                </>
            }
        </div>
    )
}

export default SingleCategory;