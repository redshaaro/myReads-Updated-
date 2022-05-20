import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Searchbooks from "./components/Searchbooks";

function App() {
  const [books, setbooks] = useState([]);
  const [sbooks, setsbooks] = useState([]);
  const [query, setquery] = useState("");
  const[MBooks,setMBooks]=useState([]);
  const [mapOfIdToBooks,setMapOfIdToBooks]=useState(new Map());
  const [available,setAvailable]=useState(false);
  const createMapOfBooks =(books)=>{
    const map= new Map();
    books.map(book=>map.set(book.id,book))
    return map;
      }
    useEffect(()=>{
    
    
    const combined =sbooks.map(book=>{
      if(mapOfIdToBooks.has(book.id)){
        return mapOfIdToBooks.get(book.id);
      }else{
        return book;
      }
    })
    setMBooks(combined);
    
    
    },[ 
      sbooks])

  useEffect(() => {
    const getBooks = async () => {
      const res = await BooksAPI.getAll();
      console.log(res);
      setbooks(res);
      setMapOfIdToBooks(createMapOfBooks(res))
    };
    getBooks();
  }, []);

  useEffect(() => {
    let isActive = true;

    if (query) {
      BooksAPI.search(query).then((data) => {
        
        
        
        if (data.error) {
          setsbooks([]);
        } else {
          if (isActive) {
            setsbooks(data);
            setAvailable(true);
          }
        }
      });
    }
    return () => {
      isActive = false;
      setsbooks([]);
      console.log("UNMOUNT data from ", query);
    };
  }, [query]);

  const changeShelf = async (book, shelf) => {
    await BooksAPI.update(book, shelf);
    BooksAPI.update(book, shelf);
    const res = await BooksAPI.getAll();

    setbooks(res);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<Home changeShelf={changeShelf} books={books}></Home>}
          ></Route>
          <Route
            path="/search"
            element={
              <Searchbooks
              query={query} setquery={setquery} MBooks={MBooks} changeShelf={changeShelf} sbooks={sbooks}available={available}
              ></Searchbooks>
            }
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
