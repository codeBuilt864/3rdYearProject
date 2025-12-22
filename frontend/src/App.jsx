import { SignInButton } from "@clerk/clerk-react";
import "./App.css";

function App() {
  return (
    <>
      <h1>welcome to the app</h1>
      <SignInButton mode="modal" />
    </>
  );
}

export default App;
