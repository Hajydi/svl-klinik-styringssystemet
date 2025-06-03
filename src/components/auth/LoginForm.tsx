
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login fejl",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Velkommen tilbage!",
          description: "Du er nu logget ind",
        });
        onLogin();
      }
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Adgangskoder matcher ikke",
        description: "Indtast den samme adgangskode begge steder",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        toast({
          title: "Registrering fejl",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registrering vellykket!",
          description: "Du kan nu logge ind med dine oplysninger",
        });
        setIsSignUp(false);
      }
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl ved registrering",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          {/* SVL Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/35855169-50b3-44b1-b946-9b48a81401a0.png" 
              alt="SVL Coaching" 
              className="h-16 w-auto"
            />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Opret konto' : 'Log ind'}
          </CardTitle>
          <p className="text-gray-600">
            {isSignUp ? 'Opret en ny konto til SVL Coaching' : 'Velkommen tilbage til SVL Coaching'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {isSignUp && (
              <div>
                <Input
                  type="text"
                  placeholder="Fulde navn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className="h-12"
                />
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Email adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Adgangskode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {isSignUp && (
              <div>
                <Input
                  type="password"
                  placeholder="Bekræft adgangskode"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={isSignUp}
                  className="h-12"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
            >
              {loading ? (
                "Vent venligst..."
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Opret konto
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Log ind
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700"
            >
              {isSignUp 
                ? 'Har du allerede en konto? Log ind her' 
                : 'Har du ikke en konto? Opret en her'
              }
            </Button>
          </div>

          {/* Jama Consulting Credit */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span>Udviklet af</span>
              <img 
                src="/lovable-uploads/fe45f5d4-81d7-412e-b4be-7125f2ff602b.png" 
                alt="Jama Consulting" 
                className="h-6 w-auto opacity-60"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
