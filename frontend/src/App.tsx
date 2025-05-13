import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import RoleSelectPage from "./pages/RoleSelectPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import StudentPage from "./pages/StudentPage.tsx";
import TeacherPage from "./pages/TeacherPage.tsx";

function App() {
  return (
      <Routes>
          <Route path="/" element={<RoleSelectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

export default App
