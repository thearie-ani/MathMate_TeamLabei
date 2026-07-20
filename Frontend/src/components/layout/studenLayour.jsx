// import { Outlet, useNavigate } from "react-router-dom";
// import StudentSidebar from "./studentSidebar.jsx";
// import StudentNavbar from "./studentNavbar.jsx";
// import { useAuth } from "../../context/AuthContext.jsx";

// export default function StudentLayout(){

//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const handleLogout = async () => {
//     await logout();

//     navigate("/login", {
//       replace: true
//     });
//   };

//   return (

//     <div className="
//       flex
//       min-h-screen
//       bg-[#faf9ff]
//     ">

//       <StudentSidebar
//         onLogout={handleLogout}
//       />

//       <div className="
//         flex-1
//         min-w-0
//       ">
//         <StudentNavbar/>

//         <main
//           className="
//             min-h-[calc(100vh-64px)]
//           "
//         >
//           <Outlet/>
//         </main>
//       </div>

//     </div>
//   );
// }

import { Outlet, useNavigate } from "react-router-dom";
import StudentSidebar from "./studentSidebar.jsx";
import StudentNavbar from "./studentNavbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import ChatWidget from "../chat/ChatWidget.jsx";

export default function StudentLayout(){

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/", {
      replace: true
    });
  };

  return (

    <div className="
      flex
      min-h-screen
      bg-[#faf9ff]
    ">

      <StudentSidebar
        onLogout={handleLogout}
      />

      <div className="
        flex-1
        min-w-0
      ">
        <StudentNavbar/>

        <main
          className="
            min-h-[calc(100vh-64px)]
          "
        >
          <Outlet/>
        </main>

      </div>

      <ChatWidget/>

    </div>
  );
}