import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [page, setPage] = useState(0);

  const BooksPerPage = 6;
  const NoOfPages = Math.ceil(
    books.filter(book => {
      const titleMatch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
      const authorMatch = book.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = locationFilter ? book.city.toLowerCase() === locationFilter.toLowerCase() : true;
      return (titleMatch || authorMatch) && locationMatch;
    }).length / BooksPerPage
  );

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4545/api/v1/book/get-books-feed', {
          withCredentials: true,
        });

        if (response.data.success) {
          setBooks(response.data.books);
        } else {
          throw new Error(response.data.message || 'Failed to fetch books');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredAndSortedBooks = books
    .filter(book => {
      const titleMatch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
      const authorMatch = book.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = locationFilter ? book.city.toLowerCase() === locationFilter.toLowerCase() : true;
      return (titleMatch || authorMatch) && locationMatch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const paginatedBooks = filteredAndSortedBooks.slice(
    page * BooksPerPage,
    (page + 1) * BooksPerPage
  );
  useEffect(()=>{
    setPage(0)
  },[searchTerm,locationFilter,sortOption])

  const cities = [...new Set(books.map(book => book.city))];

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search by title or author
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books..."
              className="w-full p-2 border rounded"
            />
          </div>

       
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Filter by location
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All locations</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

      
          <div>
            <label htmlFor="sort" className="block text-sm font-medium mb-1">
              Sort by
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="a-z">Title (A-Z)</option>
              <option value="z-a">Title (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

    
      {loading && (
        <div className="text-center py-10">
          <p className="text-lg">Loading books...</p>
        </div>
      )}

 
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredAndSortedBooks.length !== 0 && (
            <p className="mb-4">Showing {filteredAndSortedBooks.length} books</p>
          )}

          {filteredAndSortedBooks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg">No books match your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBooks.map((book) => (
                <div key={book._id} className="border rounded-lg overflow-hidden shadow-md">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={book.imageUrl || "/api/placeholder/400/320"}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                    <p className="text-gray-700 mb-1">Author: {book.author.name}</p>
                    <p className="text-gray-700 mb-1">Genre: {book.genre}</p>
                    <p className="text-gray-700 mb-1">Location: {book.city}</p>
                    <p className="text-gray-700 mb-3">Contact: {book.contact}</p>
                    <p className="text-gray-500 text-sm">
                      Added on: {new Date(book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

  
      {!loading && !error && filteredAndSortedBooks.length > 0 && (
        <div className="flex items-center gap-4 justify-center mt-9">
          <Button
            variant="outline"
            onClick={() => {
              if (page > 0) setPage(page - 1);
            }}
            disabled={page === 0}
          >
            {'<'}
          </Button>
          <p>
            {page + 1} of {NoOfPages}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              if (page < NoOfPages - 1) setPage(page + 1);
            }}
            disabled={page >= NoOfPages - 1}
          >
            {'>'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
