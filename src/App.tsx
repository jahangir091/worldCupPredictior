import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SimulationProvider } from './context/SimulationContext'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { GroupsPage } from './pages/GroupsPage'
import { SchedulePage } from './pages/SchedulePage'
import { BracketPage } from './pages/BracketPage'
import { TeamsPage } from './pages/TeamsPage'
import { PredictPage } from './pages/PredictPage'

export default function App() {
  return (
    <BrowserRouter basename="/worldCupPredictior">
      <SimulationProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="bracket" element={<BracketPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="predict" element={<PredictPage />} />
          </Route>
        </Routes>
      </SimulationProvider>
    </BrowserRouter>
  )
}
