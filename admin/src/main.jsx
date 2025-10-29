import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import  AdminContextProvider  from '../src/context/AdminContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
   
   <BrowserRouter>
   <AdminContextProvider>
       <App /> 
   </AdminContextProvider>
     </BrowserRouter>
   
)
