'use client';

import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const GmailAuthPanel = ({ onAuth, nodeType, initialEmail = '' }) => {
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Clear any existing auth state when component mounts
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('lastActiveNodeType');
    }
  }, []);

  useEffect(() => {
    // Only trigger onAuth when we have a valid session with required scopes
    if (session?.user?.email && !isAuthenticating) {
      // Check if we have the required Gmail scopes
      const hasRequiredScopes = session.accessToken && (
        nodeType === 'trigger' || nodeType === 'action'
      );

      if (!hasRequiredScopes) {
        // If we don't have the required scopes, sign out
        handleSignOut();
        return;
      }

      onAuth({
        email: session.user.email,
        isAuthenticated: true,
        nodeType,
        accessToken: session.accessToken
      });
    }
  }, [session, nodeType, onAuth, isAuthenticating]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    try {
      // Clear any existing session first
      await signOut({ redirect: false });
      
      const dashboardUrl = window.location.origin + '/dashboard';
      if (nodeType) {
        sessionStorage.setItem('lastActiveNodeType', nodeType);
      }
      
      // Initiate fresh Google Sign In
      const result = await signIn('google', { 
        callbackUrl: dashboardUrl,
        redirect: true
      });
      
      if (!result?.ok) {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Sign in error:', err);
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const dashboardUrl = window.location.origin + '/dashboard';
      sessionStorage.removeItem('lastActiveNodeType');
      await signOut({ 
        callbackUrl: dashboardUrl,
        redirect: true 
      });
      onAuth({ email: '', isAuthenticated: false, nodeType });
    } catch (err) {
      setError('Failed to sign out. Please try again.');
      console.error('Sign out error:', err);
    }
  };

  // Show loading state while authentication is in progress
  if (status === 'loading' || isAuthenticating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Gmail Authentication ({nodeType === 'trigger' ? 'Trigger' : 'Action'})
        </h4>
        {session && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Connected
          </span>
        )}
      </div>

      {!session ? (
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Connected as: <span className="font-medium">{session.user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default GmailAuthPanel; 