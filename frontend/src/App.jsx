import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Signin from "./pages/auth/Signin";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

        <Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


/*  
  * 10 habits for be a successful developer 
  1. daily practice
  2. read other developers codes
  3. understand fundamentals before tools
  4. solve problems, not just write code
  5. continue learning and updates
  6. write clean and structure code
  7. understand system, not just code
  8. works on real projects
  9. communicate with developers community
*/