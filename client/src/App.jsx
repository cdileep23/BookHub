import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Body from './components/Body'
import Home from './Pages/Home'
import Auth from './Pages/Auth'
import Profile from './Pages/Profile'
import Dashboard from './Pages/OwnerDashBoard'
import { Toaster } from 'sonner'

const App = () => {
const appRouter=createBrowserRouter([{
  path:'/',
  element:<Body/>,
  children:[
    {path:"/",
      element:<Home/>
    },{
      path:"/auth",
      element:<Auth/>
    
    },{
      path:"/profile",
      element:<Profile/>
    },{
      path:"/dashboard",
      element:<Dashboard/>
    }
  ]
}])
  
  return (
    <main>
       <Toaster position="bottom-right" richColors />
      <RouterProvider router={appRouter}/>
    </main>
  )
}

export default App
