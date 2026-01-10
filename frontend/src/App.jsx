import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";



function App() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route
          path="/dashboard"
          element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route
          path="/AboutPage"
          element={isSignedIn ? <AboutPage /> : <Navigate to={"/"} />} />

        <Route
          path="/Problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />

        {/* <Route path="/problems" element ={<ProblemsPage/> } />

        <Route path="/about" element ={<AboutPage/>} /> */}
   

        <Route path="/problem/:id" element={isSignedIn? <ProblemPage/> : <Navigate to={"/"}/>}/>

       

        {/* <Route path="/homepage" element ={<HomePage/>} />
        <Route path="/dashbord" element ={<DashboardPage/>} /> */}


      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
