import { useEffect, useState } from "react";
import api from "../api";
import EntryTable, { Entry } from "../components/EntryTable";
import './Table.css'

const Table = () => {
    const [allEntries, setAllEntries] = useState<Entry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchData = async () => {
        try {
            const response = await api.get<Entry[]>('entries');
            setAllEntries(response.data);
        } catch (error) {
            console.log('API error', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => setFilteredEntries(allEntries.filter(x => x.name.includes(searchQuery))), [allEntries, searchQuery]);
    useEffect(() => setTotalPages(Math.ceil(filteredEntries.length / 10)), [filteredEntries]);

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

            <input type="text" className="mx-auto serach-query-input form-control"  placeholder="Search entries" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>

            <nav className="pagination-nav">
                {totalPages > 1 &&
                    <ul className="pagination">
                        { currentPage > 0 && 
                            <li className="page-item">
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                    Previous
                                </button>
                            </li>
                        }

                        { Array.from({ length: totalPages }, (_, i) => i).map(pageNumber =>
                            <li className={`page-item ${currentPage == pageNumber ? 'active' : ''}`} key={pageNumber}>
                                <button className="page-link" onClick={() => setCurrentPage(pageNumber)}>
                                    { pageNumber + 1 }
                                </button>
                            </li>
                        )}

                        { currentPage < totalPages - 1 &&
                            <li className="page-item">
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                    Next
                                </button>
                            </li>
                        }
                    </ul>
                }
            </nav>

            <EntryTable entries={filteredEntries.slice(10 * currentPage, 10 * currentPage + 10)} destroyEntry={destroyEntry} />
        </div>
    )
}

export default Table;