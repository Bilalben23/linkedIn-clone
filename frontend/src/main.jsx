import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {AuthProvider} from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeButton={false}
          pauseOnHover={true}
          draggable={false}
          rtl={false}
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            padding: '10px 20px',
          }}
        />
      </AuthProvider>
    {/* <ReactQueryDevtools /> */}  
    </QueryClientProvider>
  </StrictMode>
)
