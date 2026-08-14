import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/MainLayout";
import Categorylist from "./pages/Categorylist";
import Category from "./pages/Category";
import Venue from "./pages/Venue";
import Loginadmin from "./pages/Loginadmin";
import "bootstrap/dist/css/bootstrap.min.css";

import UpdateCategory from "./pages/UpdateCategory";
import Userlist from "./pages/Userlist";
import Venuetable from "./pages/Venuetable";
import UpdateUser from "./pages/UpdateUser";
import ChoachingList from "./pages/ChoachingList";
import EventList from "./pages/EventList";
import User from "./pages/User";
import UpdateVenue from "./pages/UpdateVenue";
import CoachForm from "./pages/Coaches";
import UpdateCoach from "./pages/UpdateCoach";
import CheckValidate from "./utils/CheckValidate";
import UpdateEvent from "./pages/UpdateEvent";
import UpdatePT from "./pages/UpdatePT";
import AddPT from "./pages/AddPT";
import PersonalTrainingList from "./pages/PersonalTrainingList";
import AddEvent from "./pages/addEvent";
import EnquiryList from "./pages/EnquiryList";
import Bookings from "./pages/Bookings";
import AddSlots from "./pages/addSlots";
import VenueAdmin_Dashboard from "./pages/VenueAdmin_Dashboard";
import VenueAdminCRM from "./pages/VenueAdminCRM";
import AddCoachSlot from "./pages/addCoachSots";
import ViewCoachSlots from "./pages/viewCoachSlots";
import SlotsDetails from "./pages/slotsDetails";
import VenueSlots from "./pages/venueSlots";
import ViewVenueSlots from "./pages/viewVenueSlots";
import Blog from "./pages/Blog";
import Createblog from "./pages/createblog";
import Editblog from './pages/editblog';
import AddVenueSlots from "./pages/addVenueSlots";
import VenueAdminList from "./pages/venueAdminList";
import AddVenueAdmin from "./pages/addVanueAdmin";
import UpdateVenueAdmin from "./pages/updateVenueAdmin";
import Approve from "./pages/approve";
import AddCoach from "./pages/addCoach";
import AddPersonalTrainer from "./pages/addTrainer";
import CoachTrainerApprove from "./pages/coachTrainerApprove";
import ApproveCoachTrainer from "./pages/approveCoachTrainer";
import AddCoachTrainerSlot from "./pages/addCoachSlot";
import AddTrainerSlots from "./pages/addTrainerSlots";
import Earnings from "./pages/Earnings";


function App() {
  // Automatically redirect from "/" to "/admin" in local development
  if (window.location.pathname === "/" || window.location.pathname === "") {
    window.location.replace("/admin" + window.location.search + window.location.hash);
    return null;
  }

  return (
    <Router basename="/admin">
      <Routes>
        <Route path="/" element={<Loginadmin />} />
        <Route path="*" element={<Loginadmin />} />
        <Route path="/approve-admin/:id" element={<Approve />} />
        <Route path="/approve-coach-trainer/:id" element={<CoachTrainerApprove />} />

        <Route path="/" element={<CheckValidate />}>
          <Route path="/" element={<MainLayout />}>
            {/* <Route path="/" element={<UserLogin />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/earnings" element={<Earnings />} />

            {/* <Route path="/userprofile" element={ }>
          </Route> */}


            <Route path="/users" element={<Userlist />} />
            <Route path="/users/add" element={<User />} />
            <Route path="/UpdateUser/:_id" element={<UpdateUser />} />


            <Route path="/venue-admin" element={<VenueAdminList />} />
            <Route path="/venue-admin/add" element={<AddVenueAdmin />} />
            <Route path="/venue-admin/update/:_id" element={<UpdateVenueAdmin />} />


            <Route path="/venues" element={<Venuetable />} />
            <Route path="/venues/add" element={<Venue />} />
            <Route path="/venues/add/slots/:_id" element={<AddVenueSlots />} />
            <Route path="/venues/edit/:_id" element={<UpdateVenue />} />
            {/* <Route path="/venues/add/slots-add/:_id" element={<AddSlots />} /> */}


            <Route path="/approve-trainer-coach/:_id" element={<ApproveCoachTrainer />} />
            <Route path="/coaches" element={<ChoachingList />} />
            <Route path="/coach/add" element={<AddCoach />} />
            <Route path="/coaches/update/:_id" element={<CoachForm />} />
            <Route path="/coaches/slots-add/:_id" element={<AddCoachTrainerSlot />} />



            <Route path="/personal-training" element={<PersonalTrainingList />} />
            <Route path="/personal-training/add" element={<AddPersonalTrainer />} />
            <Route path="/personal-training/slots-add/:_id" element={<AddTrainerSlots />} />


            <Route path="/events" element={<EventList />} />
            <Route path="/event/add" element={<AddEvent />} />
            <Route path="/event/edit/:_id" element={<UpdateEvent />} />


            <Route path="/blog" element={<Blog />} />
            <Route path="/add-blog" element={<Createblog />} />
            <Route path="/editblog/:slugName" element={<Editblog />} />


            <Route path="/enquiries" element={<EnquiryList />} />


            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/addslots" element={<AddSlots />} />

            <Route path="/personal-traning/add" element={<AddPT />} />

            <Route path="/personal-training/edit/:_id" element={<UpdatePT />} />


            <Route path="/categories/add" element={<Category />} />
            <Route path="/categories" element={<Categorylist />} />
            <Route path="/categories/edit/:_id" element={<UpdateCategory />} />
            <Route path="/coaches/edit/:_id" element={<UpdateCoach />} />
            <Route path="/coaches/add-slots/:_id" element={<AddCoachSlot />} />
            <Route path="/coaches/slots/:_id" element={<ViewCoachSlots />} />
            <Route
              path="/coaches/slots-details/:_id"
              element={<SlotsDetails />}
            />
            <Route path="/venues/slots/:_id" element={<VenueSlots />} />
            <Route
              path="/venues/slots-details/:_id"
              element={<ViewVenueSlots />}
            />
          </Route>

          {/* Venue Admin Dashboard */}
          <Route
            path="/venue-admin-dashboard"
            element={<VenueAdmin_Dashboard />}
          >
            <Route path="/venue-admin-dashboard/" element={<Venue />} />
            <Route
              path="/venue-admin-dashboard/venues/table"
              element={<Venuetable />}
            />
            <Route
              path="/venue-admin-dashboard/crm"
              element={<VenueAdminCRM />}
            />
            {/* <Route path="/venue-admin-dashboard/venues/edit/:_id" element={<UpdateVenue />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
