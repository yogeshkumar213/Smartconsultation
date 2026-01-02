import SignupAuth from "./SignupAuth.jsx";
import SigninAuth from "./SigninAuth.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext.jsx";
const AuthParent = () => {
  return (
    // <div>

    <AuthProvider>
      <div style={{ display: "flex" ,justifyContent:"center",alignItems:"center",minHeight:"100vh"}}>
        <Routes>
          <Route path="signup" element={<SignupAuth />}></Route>

          <Route path="signin" element={<SigninAuth />}></Route>
        </Routes>
        {/* <SignupAuth/>
        <SigninAuth/> */}
      </div>
    </AuthProvider>

    // </div>
  );
};
export default AuthParent;
