import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";


createRoot(document.getElementById('root')!).render(
    <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ChakraProvider>
)
