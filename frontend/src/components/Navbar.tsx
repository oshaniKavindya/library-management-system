import { useAuth0 } from "@auth0/auth0-react";
import { BookOpenIcon } from "./icons";

export default function Navbar() {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } =
    useAuth0();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">LibraryMS</span>
          </div>

          {/* Auth Controls */}
          <div className="flex items-center gap-4">
            {isLoading ? null : isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user?.email}
                  </span>
                </div>
                <button
                  onClick={() =>
                    logout({
                      logoutParams: {
                        returnTo: window.location.origin + "/login",
                      },
                    })
                  }
                  className="btn-secondary text-sm py-1.5"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="btn-primary text-sm py-1.5"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
