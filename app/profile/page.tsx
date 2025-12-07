"use client";

import {
  UserProfile,
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="flex justify-center py-10">
      {/* If user is logged in → show profile */}
      <SignedIn>
        <UserProfile />
      </SignedIn>

      {/* If user NOT logged in → show message + login btn */}
      <SignedOut>
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold">
            You must be signed in to view your profile.
          </p>
          <SignInButton mode="modal">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
