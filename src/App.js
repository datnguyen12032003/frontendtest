import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login/Login";
import SignUp from "./components/Login/Signup";
import ResetPassword from "./components/Login/ForgotPassword";
import ProfilePage from "./components/user/profile";
import About from "./components/About";
import Contact from "./components/Contact";
import HouseList from "./components/HouseList";
import CreateRoom from "./components/admin/CreateRoom";
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateLandlord from "./components/admin/CreateLandLord";
import LandlordList from "./components/admin/LandLordList";
import LandlordDetail from "./components/admin/LandLordDetail";
import RoomListAdmin from "./components/admin/RoomListAdmin";
import RoomDetailAdmin from "./components/admin/RoomDetailAdmin";
import AvatarUpload from "./components/admin/AvatarUpload";
import RoomImageUpload from "./components/admin/RoomImageUpload ";
import Sidebar from "./components/admin/Sidebar";
import UserListAdmin from "./components/admin/UserListAdmin";
import UserDetailAdmin from "./components/admin/UserDetailAdmin";
import EntryHistoryList from "./components/admin/EntryHistoryList";
import RoomDetail from "./components/RoomDetail";
import { UserProvider } from "./components/context/UserContext";
import Home from "../src/components/Home/Home";
import SuccessPage from "./components/admin/paymentStatus/SuccessPage";
import CancelPage from "./components/admin/paymentStatus/CancelPage";
import Revenue from "./components/admin/Revenue";
import PaymentHistory from "./components/admin/PaymentHistory";
import UserHistory from "./components/user/UserHistory";
import { HomeList } from "./components/Home/homesList";
import RoomList from "./components/Home/HouseList";
import { RoomProvider } from "./components/context/RoomContext";
import FavoriteList from "./components/Home/FavoriteList";

// import { ToastContainer } from 'react-toastify';

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <UserProvider>
        <RoomProvider>
          <Navbar onSearch={handleSearch} />
          {/* <div className="flex"> */}
          {/* <Sidebar /> */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user-history" element={<UserHistory />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/roomList" element={<RoomList />} />
            <Route path="/favoriteList" element={<FavoriteList />} />

            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route
              path="/houses-list"
              element={<HouseList searchTerm={searchTerm} />}
            />
            <Route path="/house-list/:roomId" element={<RoomDetail />} />
            {/* administrators */}
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/land-lord-list" exact element={<LandlordList />} />
            <Route path="/land-lord-list/:id" element={<LandlordDetail />} />
            <Route path="/create-land-lord" element={<CreateLandlord />} />
            <Route
              path="/land-lord-list/:id/create-room"
              element={<CreateRoom />}
            />
            <Route
              path="/land-lord-list/:id/rooms"
              element={<RoomListAdmin />}
            />
            <Route
              path="/room-details-admin/:roomId"
              element={<RoomDetailAdmin />}
            />
            <Route
              path="/land-lord-list/:id/upload-avatar"
              element={<AvatarUpload />}
            />
            <Route
              path="/upload-room-image/:roomId"
              element={<RoomImageUpload />}
            />
            <Route path="/users-list-admin" element={<UserListAdmin />} />
            <Route path="/users-list-admin/:id" element={<UserDetailAdmin />} />
            <Route path="/entry" element={<EntryHistoryList />} />
            {/* <Route path="/house-list-admin" element={< />} /> */}
            {/* payment */}
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route path="/payment-history" element={<PaymentHistory />} />

            {/* Revenue */}
            <Route path="/revenue" element={<Revenue />} />
          </Routes>

          {/* </div> */}
          {/* <ToastContainer /> */}
          <Footer />
        </RoomProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
