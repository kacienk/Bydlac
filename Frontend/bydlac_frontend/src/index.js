import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <div className='all'>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
            </style>
        </head>
        <App />
    </div>
  //</React.StrictMode>
);