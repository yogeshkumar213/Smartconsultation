import { useState } from "react";
import PatientDash from "./pages/Patientdash/PatientParent.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DocterDash from "./pages/docterdash/DocterParent.jsx";
import { Test } from "./pages/Patientdash/test.jsx";
import { ProfileDetails } from "../src/pages/Patientdash/UserProfile/UserProfile.jsx";

import { Dropdown } from "./pages/Patientdash/Dropdown.jsx";
import { DropdownProvider } from "./context/DropdownContext.jsx";

import AuthParent from "./pages/Authentication/AuthParent.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { SnakbarProvider } from "./context/Snakbarr.jsx";
import { DepartmentProvider } from "./pages/Patientdash/Department.jsx";
import { SearchProvider } from "./pages/Patientdash/Searchbar.jsx";
import { PatientFormProvider } from "./context/PatientFormContext.jsx";
import "./App.css";


function App() {
  return (
    <div className="User-Interface" style={{ minHeight: "100vh" }}>
      <Router>
        <PatientFormProvider>
          {/* <Card> */}
          <AuthProvider>
            <SnakbarProvider>
              {/* <CardProvider> */}
              <DepartmentProvider>
                <SearchProvider>
                  <DropdownProvider>
                  {/* <Test/> */}
                    <Routes>
                      <Route
                        path="/user-profile"
                        element={<ProfileDetails />}
                      ></Route>
                      {/* <Route path="/dropdown" element={<Dropdown />}></Route> */}
                      <Route
                        path="/docter-dashboard"
                        element={<DocterDash />}
                      ></Route>
                      <Route
                        path="/user-dashboard"
                        element={<PatientDash />}
                      ></Route>
                      <Route path="/auth/*" element={<AuthParent />}></Route>
                    </Routes>
                  </DropdownProvider>
                </SearchProvider>
              </DepartmentProvider>
            </SnakbarProvider>
          </AuthProvider>
        </PatientFormProvider>
      </Router>
    </div>
  );
}

export default App;
