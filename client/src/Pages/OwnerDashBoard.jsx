import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Book form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    city: '',
    imageUrl: ''
  });

  // Genre options
  const genreOptions = [
    'Action', 'Adventure', 'Biography', 'Comedy', 'Drama', 'Fantasy',
    'Fiction', 'History', 'Horror', 'Mystery', 'Non-fiction', 'Romance',
    'Science Fiction', 'Self-help', 'Thriller'
  ];
  
  // City options
  const cityOptions = [
    'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  // Redirect if user is not owner
  useEffect(() => {
    if (user?.role === "Seeker") {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4545/api/v1/book/owner/get-books', {
          withCredentials: true
        });
        
        if (response.data.success) {
          setBooks(response.data.books);
        } else {
          throw new Error(response.data.message || 'Failed to fetch books');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        toast.error('Error: ' + errorMessage);
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select change (for dropdowns)
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open edit dialog and populate form
  const handleEditClick = (book) => {
    setCurrentBook(book);
    setFormData({
      title: book.title,
      genre: book.genre,
      city: book.city,
      imageUrl: book.imageUrl
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (book) => {
    setCurrentBook(book);
    setIsDeleteDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      genre: '',
      city: '',
      imageUrl: ''
    });
    setCurrentBook(null);
  };

  // Add new book
  const handleAddBook = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4545/api/v1/book/add-book',
        formData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setBooks(prev => [...prev, response.data.book]);
        toast.success('Book added successfully!');
        setIsAddDialogOpen(false);
        resetForm();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add book';
      toast.error(errorMessage);
      console.error('Error adding book:', err);
    }
  };

  // Update book
  const handleUpdateBook = async () => {
    if (!currentBook) return;
    
    try {
      const response = await axios.put(
        `http://localhost:4545/api/v1/book/update-book-owner/${currentBook._id}`,
        formData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setBooks(prev => 
          prev.map(book => 
            book._id === currentBook._id ? { ...book, ...formData } : book
          )
        );
        toast.success('Book updated successfully!');
        setIsEditDialogOpen(false);
        resetForm();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update book';
      toast.error(errorMessage);
      console.error('Error updating book:', err);
    }
  };

  // Delete book
  const handleDeleteBook = async () => {
    if (!currentBook) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:4545/api/v1/book/delete-book/${currentBook._id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setBooks(prev => prev.filter(book => book._id !== currentBook._id));
        toast.success('Book deleted successfully!');
        setIsDeleteDialogOpen(false);
        resetForm();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete book';
      toast.error(errorMessage);
      console.error('Error deleting book:', err);
    }
  };

  if (user?.role === "Seeker") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add New Book</Button>
      </div>

      {/* Books Table */}
      <div className="rounded-md border">
        <Table>
          
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No books found. Add your first book to get started.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>
                    <img 
                      src={book.imageUrl || "/api/placeholder/80/80"} 
                      alt={book.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.city}</TableCell>
                  <TableCell>{new Date(book.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(book)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteClick(book)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Enter the details of the book you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right">
                Genre
              </Label>
              <Select 
                onValueChange={(value) => handleSelectChange('genre', value)}
                value={formData.genre}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genreOptions.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Select 
                onValueChange={(value) => handleSelectChange('city', value)}
                value={formData.city}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBook}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the details of your book.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-genre" className="text-right">
                Genre
              </Label>
              <Select 
                onValueChange={(value) => handleSelectChange('genre', value)}
                value={formData.genre}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genreOptions.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-city" className="text-right">
                City
              </Label>
              <Select 
                onValueChange={(value) => handleSelectChange('city', value)}
                value={formData.city}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="edit-imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBook}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentBook?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBook}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;