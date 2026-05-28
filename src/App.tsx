import { NavigationProvider, useNavigation } from '@/components/NavigationContext'
import { TopBar } from '@/components/TopBar'
import { Sidebar } from '@/components/Sidebar'
import { HomePage } from '@/pages/HomePage'
import { Chapter1PPF } from '@/pages/chapters/Chapter1PPF'
import { Chapter2Production } from '@/pages/chapters/Chapter2Production'
import { Chapter3Costs } from '@/pages/chapters/Chapter3Costs'
import { Chapter4Demand } from '@/pages/chapters/Chapter4Demand'
import { Chapter5Elasticity } from '@/pages/chapters/Chapter5Elasticity'
import { Chapter6Equilibrium } from '@/pages/chapters/Chapter6Equilibrium'
import { Chapter7Intervention } from '@/pages/chapters/Chapter7Intervention'
import { Chapter8OpenEconomy } from '@/pages/chapters/Chapter8OpenEconomy'
import { Chapter9Tariff } from '@/pages/chapters/Chapter9Tariff'
import { Chapter10Monopoly } from '@/pages/chapters/Chapter10Monopoly'
import { Chapter11Solutions } from '@/pages/chapters/Chapter11Solutions'

function AppContent() {
  const { currentChapter } = useNavigation()

  const renderChapter = () => {
    switch (currentChapter) {
      case 'ppf':          return <Chapter1PPF />
      case 'production':   return <Chapter2Production />
      case 'costs':        return <Chapter3Costs />
      case 'demand':       return <Chapter4Demand />
      case 'elasticity':   return <Chapter5Elasticity />
      case 'equilibrium':  return <Chapter6Equilibrium />
      case 'intervention': return <Chapter7Intervention />
      case 'open-economy': return <Chapter8OpenEconomy />
      case 'tariff':       return <Chapter9Tariff />
      case 'monopoly':     return <Chapter10Monopoly />
      case 'solutions':    return <Chapter11Solutions />
      default:             return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <TopBar />
      <Sidebar />
      <main className="pt-14">
        {renderChapter()}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  )
}
