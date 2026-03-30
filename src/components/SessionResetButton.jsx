// // src/components/SessionResetButton.jsx
// import { useState } from 'react'
// import { supabase } from '@/lib/supabaseClient'
// import { RefreshCw } from 'lucide-react'

// export const SessionResetButton = () => {
//   const [resetting, setResetting] = useState(false)

//   const resetSession = async () => {
//     setResetting(true)
//     try {
//       // Clear all auth storage
//       localStorage.removeItem('starconnect-auth')
//       localStorage.removeItem('sb-fkdqzewjrtassgfofqyd-auth-token')
      
//       // Sign out
//       await supabase.auth.signOut()
      
//       // Redirect to login
//       window.location.href = '/login'
//     } catch (error) {
//       console.error('Reset error:', error)
//       window.location.href = '/login'
//     } finally {
//       setResetting(false)
//     }
//   }

//   return (
//     <button
//       onClick={resetSession}
//       disabled={resetting}
//       className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition z-50"
//       title="Reset Session"
//     >
//       <RefreshCw className={`w-5 h-5 ${resetting ? 'animate-spin' : ''}`} />
//     </button>
//   )
// }