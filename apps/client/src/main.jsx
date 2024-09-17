import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import CssBaseline from '@mui/material/CssBaseline';
import { AuthContext } from "@root/context/auth/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <AuthContext><App/></AuthContext>
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastContainer />
      </QueryClientProvider>
  </StrictMode>,
)
