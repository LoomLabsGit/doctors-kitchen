import { Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import { Home, Index, List, Search } from './screens/Recipes'
import RecipeDetail from './screens/RecipeDetail'
import { PlanBuilding, PlanDetail, PlanHome } from './screens/Plan'
import { SavedCollection, SavedFixed, SavedHome } from './screens/Saved'
import Stub from './screens/Stub'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="cuisines" element={<Index kind="cuisines" />} />
        <Route path="ingredients" element={<Index kind="ingredients" />} />
        <Route path="cuisine/:name" element={<List kind="cuisine" />} />
        <Route path="ingredient/:name" element={<List kind="ingredient" />} />
        <Route path="meal/:name" element={<List kind="meal" />} />
        <Route path="category/:name" element={<List kind="category" />} />
        <Route path="search" element={<Search />} />
        <Route path="recipe/:slug" element={<RecipeDetail />} />
        <Route path="plan" element={<PlanHome />} />
        <Route path="plan/building" element={<PlanBuilding />} />
        <Route path="plan/:id" element={<PlanDetail />} />
        <Route path="progress" element={<Stub name="Progress" folder="05_Progress" />} />
        <Route path="saved" element={<SavedHome />} />
        <Route path="saved/rated" element={<SavedFixed kind="rated" />} />
        <Route path="saved/cooked" element={<SavedFixed kind="cooked" />} />
        <Route path="saved/:id" element={<SavedCollection />} />
        <Route path="learn" element={<Stub name="Learn" folder="06_Learn" />} />
        <Route path="about" element={<Stub name="About" folder="07_About" />} />
        <Route path="profile" element={<Stub name="Profile" folder="08_Profile" />} />
      </Route>
    </Routes>
  )
}
