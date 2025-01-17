import { ChangeEvent, FC } from 'react';

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;

}

const Search: FC<SearchProps> = ({ searchQuery, setSearchQuery }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };
    return (
    <form className="flex items-center max-w-sm mx-auto">   
        <label htmlFor="simple-search" className="sr-only">Buscar</label>
        <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input 
            value={searchQuery} onChange={handleChange}
            type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full ps-10 p-2.5" placeholder="Buscar por nombre..." required />
        </div>
    </form>
    )
}

export default Search;