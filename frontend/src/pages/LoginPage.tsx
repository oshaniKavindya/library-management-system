import { useAuth0 } from '@auth0/auth0-react'
import { BookOpenIcon } from '../components/icons'

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#fafafa]">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/60 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/60 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row items-center gap-12 p-6">

        {/* Branding Section */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600">Library Management System</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
            Manage your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Stories.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-md leading-relaxed">
            Your complete platform to organize and manage your book collection in one place.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-4">
            {['Fast and easy book management', 'Search and filter your collection', 'Secure and private access'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-gray-600 font-medium">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Action Card */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200 mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
              <BookOpenIcon className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to start?</h2>
            <p className="text-gray-500 text-center mb-10">
              Sign in to manage your book collection.
            </p>

            <button
              onClick={() => loginWithRedirect()}
              className="group relative w-full h-14 flex items-center justify-center bg-gray-900 hover:bg-black text-white rounded-2xl transition-all duration-300 shadow-lg"
            >
              <span className="font-bold text-lg">Continue to Library</span>
              <div className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Authorized access only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}