import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage              from "./pages/LandingPage";
import SignUp                   from "./pages/SignUp";
import Login                    from "./pages/Login";
import ChooseTherapist          from "./pages/ChooseTherapist";
import Dashboard                from "./pages/Dashboard";
import Calendar                 from "./pages/Calendar";
import MonthlyReport            from "./pages/MonthlyReport";
import Profile                  from "./pages/Profile";
import TherapistDashboard       from "./pages/TherapistDashboard";
import TherapistPatients        from "./pages/TherapistPatients";
import TherapistPatientView     from "./pages/TherapistPatientView";
import TherapistNotes           from "./pages/TherapistNotes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                        element={<LandingPage />} />
        <Route path="/signup"                  element={<SignUp />} />
        <Route path="/login"                   element={<Login />} />
        <Route path="/choose-therapist"        element={<ChooseTherapist />} />
        <Route path="/dashboard"               element={<Dashboard />} />
        <Route path="/calendar"                element={<Calendar />} />
        <Route path="/report"                  element={<MonthlyReport />} />
        <Route path="/profile"                 element={<Profile />} />
        <Route path="/therapist"               element={<TherapistDashboard />} />
        <Route path="/therapist/patients"      element={<TherapistPatients />} />
        <Route path="/therapist/patients/:id"  element={<TherapistPatientView />} />
        <Route path="/therapist/notes"         element={<TherapistNotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
