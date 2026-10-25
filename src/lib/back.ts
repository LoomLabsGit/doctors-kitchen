import { useLocation, useNavigate } from 'react-router-dom'

// Back arrows, as in the app (the website leaves this to the browser's own back button).
// Bottom-bar roots have none; the building screen moves on by itself.
const ROOTS = ['/', '/plan', '/progress', '/saved', '/learn', '/plan/building']
export const hasBack = (path: string) => !ROOTS.includes(path)

// Where a screen goes back to when there is no history to go back through (e.g. it was opened from a link).
// Meal lists go to Recipes home, not the Meal types page, because that page only exists in the improved version.
function parentOf(path: string) {
  const top = '/' + path.split('/')[1]
  if (['/cuisines', '/ingredients', '/meals', '/search', '/recipe'].includes(top)) return '/'
  if (['/cuisine', '/ingredient', '/meal', '/category'].includes(top)) return { '/cuisine': '/cuisines', '/ingredient': '/ingredients', '/meal': '/', '/category': '/' }[top]!
  if (path.startsWith('/profile/')) return '/profile'
  if (top === '/profile') return '/'
  return top
}

// Goes back one step in the prototype's own history, or, if this is the first screen opened, replaces it with its
// parent (replacing rather than pushing, so pressing back again keeps moving up instead of bouncing between the two).
export function useBack() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  return () => ((window.history.state?.idx ?? 0) > 0 ? nav(-1) : nav(parentOf(pathname), { replace: true }))
}
