import { Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import { Home, Index, List, Search } from './screens/Recipes'
import RecipeDetail from './screens/RecipeDetail'
import { PlanBuilding, PlanDetail, PlanHome } from './screens/Plan'
import { ProgressHome } from './screens/Progress'
import { LearnHome, LearnItem, LearnList, LearnSearch, LearnTopic, ProteinCalculator } from './screens/Learn'
import { SavedCollection, SavedFixed, SavedHome } from './screens/Saved'
import { ChatHistory, FoodPreferences, NotificationPreferences, ProfileAccount, ProfileHome, Subscription } from './screens/Profile'

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
        <Route path="progress" element={<ProgressHome />} />
        <Route path="saved" element={<SavedHome />} />
        <Route path="saved/rated" element={<SavedFixed kind="rated" />} />
        <Route path="saved/cooked" element={<SavedFixed kind="cooked" />} />
        <Route path="saved/:id" element={<SavedCollection />} />
        <Route path="learn" element={<LearnHome />} />
        <Route path="learn/search" element={<LearnSearch />} />
        <Route path="learn/read" element={<LearnList kind="read" />} />
        <Route path="learn/listen" element={<LearnList kind="listen" />} />
        <Route path="learn/watch" element={<LearnList kind="watch" />} />
        <Route path="learn/topic/:slug" element={<LearnTopic />} />
        <Route path="learn/item/:id" element={<LearnItem />} />
        <Route path="learn/protein" element={<ProteinCalculator />} />
        <Route path="profile" element={<ProfileHome />} />
        <Route path="profile/account" element={<ProfileAccount />} />
        <Route path="profile/food" element={<FoodPreferences />} />
        <Route path="profile/notifications" element={<NotificationPreferences />} />
        <Route path="profile/subscription" element={<Subscription />} />
        <Route path="profile/chats" element={<ChatHistory />} />
      </Route>
    </Routes>
  )
}
