import {Routes, Route} from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import WorkerLayout from "../layouts/WorkerLayout";
import Home from "../modules/user/pages/Home";
import Service from "../modules/user/pages/Service"
import ProfessionalWorker from "../modules/user/pages/ProfessionalWorker"
import About from "../modules/user/pages/About"
import Contact from "../modules/user/pages/Contact"
import ServiceDetails from "../modules/user/pages/ServiceDetails"
import BookingService from "../modules/user/pages/BookingService"
import BookingSuccess from "../modules/user/pages/BookingSucess"
import SignUp from "../modules/user/pages/SignUp"
import Login from "../modules/user/pages/Login"
import ForgotPassword from "../modules/user/pages/ForgotPassword"
import CustomerDashboard from "../modules/user/pages/CustomerDashboard"

import WorkerDashboard from "../modules/worker/Pages/WorkerDashboard"
import MyJobs from "../modules/worker/Pages/MyJobs"
import Schedule from "../modules/worker/Pages/Schedule"
import Salarys from "../modules/worker/Pages/Salarys"
import Reviews from "../modules/worker/Pages/Review"
import MyProfile from "../modules/worker/Pages/MyProfile"


import AdminRoutes from "../routes/AdminRoutes";
import AdminLogin from "../modules/Admin/Pages/AdminLogin";
import AdminLayout from "../layouts/AdminLayout"
import AdminDashboard from "../modules/Admin/Pages/AdminDashboard";
import Customers from "../modules/Admin/Pages/Customers";
import Bookings from "../modules/Admin/Pages/Bookings";
import Workers from "../modules/Admin/Pages/Workers"
import Services from "../modules/Admin/Pages/Services"
import Reports from "../modules/Admin/Pages/Reports";
import Categories from "../modules/Admin/Pages/Categories";
import Payments from "../modules/Admin/Pages/Payments";
import AdminReviews from "../modules/Admin/Pages/AdminReviews";
import WorkerRoute from "../routes/WorkerRoutes";

import CmsHome from "../modules/Admin/Pages/CmsHome";
import CmsContact from "../modules/Admin/Pages/CmsContact";
import CmsAbout from "../modules/Admin/Pages/CmsAbout";
import CmsFooter from "../modules/Admin/Pages/CmsFooter";
import CmsNavbar from "../modules/Admin/Pages/CmsNavbar";
import CmsWorker from "../modules/Admin/Pages/CmsWorker";
import CmsService from "../modules/Admin/Pages/CmsService";
import AdminProfile from "../modules/Admin/Pages/AdminProfile";
export default function AppRoutes() {
  return (
    <Routes>

      {/* USER */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Service />}/>
        <Route path="/workers" element={<ProfessionalWorker />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/servicesid/:id" element={<ServiceDetails />} />
        <Route path="/booking" element={<BookingService />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />


      </Route>
      {/* WORKER ROUTES */}
      <Route
       element={
      <WorkerRoute> 
         <WorkerLayout />  
      </WorkerRoute>}>
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        <Route path="/jobs" element={<MyJobs />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/salary" element={<Salarys />} />
        <Route path="/reviews" element={<Reviews />} /> 
        <Route path="/profile" element={<MyProfile />} />
      </Route>


       {/* ADMIN ROUTES */}
      <Route path="/admin-login" element={<AdminLogin />} /> 

      <Route  element={<AdminRoutes>
                 <AdminLayout /> 
                      </AdminRoutes>} >
        <Route path="/admin-profile" element={<AdminProfile />} />             
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-customers" element={<Customers />} />
        <Route path="/admin-bookings" element={<Bookings />} /> 
        <Route path="/admin-Workers" element={<Workers />} />
        <Route path="/admin-services" element={<Services />} />
        <Route path="/admin-reports" element={<Reports />} />
        <Route path="/admin-categories" element={<Categories />} />
        <Route path="/admin-Payments" element={<Payments />} />
        <Route path="/admin-reviews" element={<AdminReviews />}/>
        {/* <Route path="/admin-cmsoverview" element={<CMSOverview />} /> */}
        <Route path="/admin-cmshome" element={<CmsHome />} />
        <Route path="/admin-cmscontact" element={<CmsContact />} />
        <Route path="/admin-cmsabout" element={<CmsAbout />} />
        <Route path="/admin-cmsfooter" element={<CmsFooter />} />
        <Route path="/admin-cmsnavigation" element={<CmsNavbar />} />
        <Route path="/admin-cmsprofessionals" element={<CmsWorker />} />
        <Route path="/admin-cmsservices" element={<CmsService />} />



      </Route>


    </Routes>
  );
}