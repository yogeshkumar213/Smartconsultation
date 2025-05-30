import { useContext, createContext, Children, useState } from "react";
const getProfileContext = createContext();
export const DropdownProvider = ({ children }) => {
  const [getProfile, setGetProfile] = useState({});
  return (
    <getProfileContext.Provider value={{getProfile,setGetProfile}}>
      {children}
    </getProfileContext.Provider>
  );
};
export const UserProfile=()=>{
   return useContext(getProfileContext);
}
