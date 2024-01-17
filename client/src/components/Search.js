import React, { useState } from 'react';
import './Search.css'; 

const SearchFunc = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('content');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery, searchCategory);
  };

  const isTextInputRequired = searchCategory === 'content' || searchCategory === 'user';

  return (
    <form onSubmit={handleSubmit} className="search-bar-container">
      {isTextInputRequired && (
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Query..."
          className="search-bar-input"
        />
      )}
      <select 
        value={searchCategory} 
        onChange={(e) => setSearchCategory(e.target.value)} 
        className="search-bar-select"
      >
        <option value="content">Content</option>
        <option value="user">User</option>
        <option value="highestLikes">Most Liked</option>
        <option value="lowestLikes">Least Liked</option>
      </select>
      <button 
        type="submit" 
        className="search-bar-button"
      >
        Search
      </button>
    </form>
  );
};

export default SearchFunc;
