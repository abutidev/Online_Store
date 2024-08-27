import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ShopContextProvider from './Context/ShopContext';
// import  from './context/shop-context';

// Create the root of the React component tree using the DOM element with the ID 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  /* Wrap the entire application in the ShopContextProvider
   This ensures that the context values provided by ShopContextProvider
   are accessible to all components within the <App /> component
  */ 
  <ShopContextProvider>
    <App />
  </ShopContextProvider>
    
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
