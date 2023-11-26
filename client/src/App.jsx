import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Profile,
  About,
  Signin,
  Signup,
  CreateListing,
  Listing,
} from "./pages/index";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main className="bg-slate-200 w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
