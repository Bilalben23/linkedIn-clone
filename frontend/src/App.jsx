import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Profile from "./pages/Profile";
import PersistLogin from "./components/PersistLogin";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - only guests (not logged in) can access */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Route>


        {/* Protected routes - requires authentication*/}
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/profile" element={<Profile />} />

              {/* .... */}

            </Route>
          </Route>
        </Route>

        {/* Catch-All 404 Page */}
        <Route path="*" element={<h1 className="text-center text-2xl">404 - Page Not Found</h1>} />

      </Routes>

    </BrowserRouter>
  )
}


/*  
 * 10 Habits to Become a Successful Developer  
    1. Practice coding daily.  
    2. Read and analyze other developers' code.  
    3. Understand the fundamentals before focusing on tools.  
    4. Solve real-world problems, not just write code.  
    5. Keep learning and stay updated with new technologies.  
    6. Write clean, structured, and maintainable code.  
    7. Understand systems architecture, not just individual code snippets.  
    8. Work on real projects to gain hands-on experience.  
    9. Engage with and contribute to the developer community.  
    10. Learn to debug efficiently and optimize performance.  
*/