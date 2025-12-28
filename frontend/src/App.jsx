import { SignInButton, useUser } from "@clerk/clerk-react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  const { isSignedIn } = useUser();

  return (
    <>
      <Routes>
        {/* <h1>welcome to the app</h1> */}
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/problem"
          element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />}
        ></Route>
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
