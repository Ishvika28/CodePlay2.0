import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"

import CreateRoom from "./pages/CreateRoom"
import JoinRoom from "./pages/JoinRoom"
import Room from "./pages/Room"
import Problem from "./pages/Problem"
import Profile from "./pages/Profile"
import Leaderboard from "./pages/Leaderboard"

import SubmitCode from "./components/SubmitCode"

import AdminDashboard from "./pages/AdminDashboard"
import AddProblem from "./pages/AddProblem"
import ViewProblems from "./pages/ViewProblems"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <Router>

      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-room"
          element={
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/join-room"
          element={
            <ProtectedRoute>
              <JoinRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room/:roomCode"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room/:roomCode/problem/:problemId"
          element={
            <ProtectedRoute>
              <Problem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit/:roomCode"
          element={
            <ProtectedRoute>
              <SubmitCode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard/:roomCode"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-problem"
          element={
            <ProtectedRoute roleRequired="admin">
              <AddProblem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/problems"
          element={
            <ProtectedRoute roleRequired="admin">
              <ViewProblems />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>

    </Router>
  )
}

export default App