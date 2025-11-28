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
import { DocterProfile } from "./pages/docterdash/DocterProfile/DocterProfile.jsx";
import { DocterProfileEdit } from "./pages/docterdash/DocterProfile/DocterProfileEdit.jsx";
import { DocterContextProvider } from "./context/DocterAuthContext.jsx";
import { Logout } from "./pages/docterdash/DocterProfile/Logout.jsx";
import { TotalPatientCollectionProvider } from "./context/DocterAuthContext.jsx";
import { UpComingAppointmentProvider } from "./context/PatientFormContext.jsx";
// import { History } from "./pages/docterdash/History1.jsx/History.jsx";
import "./App.css";

function App() {
  return (
    <div className="User-Interface" style={{ minHeight: "100vh" }}>
      <Router>
        <PatientFormProvider>
          <AuthProvider>
            <UpComingAppointmentProvider>
              {/* <Card> */}
              <SnakbarProvider>
                {/* <CardProvider> */}
                <DepartmentProvider>
                  <SearchProvider>
                    <DropdownProvider>
                      <TotalPatientCollectionProvider>
                        <DocterContextProvider>
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
                            <Route
                              path="/auth/*"
                              element={<AuthParent />}
                            ></Route>

                            {/* docter routes */}

                            <Route
                              path="/docter-profile"
                              element={<DocterProfile />}
                            ></Route>
                            <Route
                              path="/docter-profile-edit"
                              element={<DocterProfileEdit />}
                            ></Route>
                            <Route path="/doc-logout" element={<Logout />}>
                              {" "}
                            </Route>
                            {/* <Route path="/history" element={<History/>}></Route> */}
                          </Routes>
                        </DocterContextProvider>
                      </TotalPatientCollectionProvider>
                    </DropdownProvider>
                  </SearchProvider>
                </DepartmentProvider>
              </SnakbarProvider>
            </UpComingAppointmentProvider>
          </AuthProvider>
        </PatientFormProvider>
      </Router>
    </div>
  );
}

export default App;
