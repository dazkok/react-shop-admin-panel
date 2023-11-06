import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Users from "./pages/users/Users";
import UserForm from "./pages/users/UserForm";
// import Links from "./pages/Links";
import Login from "./pages/Login";
import RedirectToUsers from "./components/RedirectToUsers";
import Products from "./pages/products/Products";
import ProductForm from "./pages/products/ProductForm";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Categories from "./pages/categories/Categories";
import CategoryForm from "./pages/categories/CategoryForm";

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={'/'} caseSensitive element={<RedirectToUsers/>}/>
            <Route path={'/login'} element={<Login/>}/>

            <Route path={'/users'} caseSensitive element={<Users/>}/>
            <Route path={'/users/create'} element={<UserForm/>}/>
            <Route path={'/users/:id/edit'} element={<UserForm/>}/>

            <Route path={'/categories'} element={<Categories/>}/>
            <Route path={'/categories/create'} element={<CategoryForm/>}/>
            <Route path={'/categories/:id/edit'} element={<CategoryForm/>}/>

            <Route path={'/products'} element={<Products/>}/>
            <Route path={'/products/create'} element={<ProductForm/>}/>
            <Route path={'/products/:id/edit'} element={<ProductForm/>}/>

            <Route path={'/orders'} element={<Orders/>}/>
            <Route path={'/profile'} element={<Profile/>}/>
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
