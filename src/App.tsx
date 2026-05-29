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
      {/* WhatsApp floating button — bottom left */}
      <a
        href="https://api.whatsapp.com/send?phone=972544242706"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#25D366' }}
        title="שלח הודעה בוואטסאפ"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="hidden sm:inline">וואטסאפ</span>
      </a>
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
