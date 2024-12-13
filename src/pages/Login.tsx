import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          toast.error('Error checking authentication status');
        }
        
        if (session) {
          navigate('/');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error during session check:', err);
        toast.error('An unexpected error occurred');
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event);
        
        if (event === 'SIGNED_IN' && session) {
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (event === 'USER_UPDATED') {
          console.log('User updated:', session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(222.2 47.4% 11.2%)',
                    brandAccent: 'hsl(210 40% 98%)',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in ...',
                },
                sign_up: {
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up ...',
                },
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;