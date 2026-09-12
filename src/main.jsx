import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BookingInvoice } from './components/BookingInvoice/BookingInvoice';

const isInvoicePage =
  window.location.pathname.includes('booking-invoice') ||
  window.location.hash.includes('booking-invoice') ||
  window.location.search.includes('id=PBM');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isInvoicePage ? <BookingInvoice /> : <App />}
  </React.StrictMode>
);

