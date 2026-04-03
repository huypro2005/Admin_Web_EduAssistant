import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import { TeleTeachersPage } from "./pages/TeleTeachersPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { ClassesPage } from "./pages/ClassesPage";
import { TeachersPage } from "./pages/TeachersPage";
import { SubjectClassesPage } from "./pages/SubjectClassesPage";
import { ClassStudentsPage } from "./pages/ClassStudentsPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/tele-teachers" replace />} />
            <Route path="tele-teachers" element={<TeleTeachersPage />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route
              path="classes/:classId/students"
              element={<ClassStudentsPage />}
            />
            <Route path="teachers" element={<TeachersPage />} />
            <Route
              path="subject-classes"
              element={<SubjectClassesPage />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/tele-teachers" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
