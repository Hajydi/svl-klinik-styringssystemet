
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Sparkles, Zap } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
          description: "Du er nu logget ind.",
        });
        onLogin();
      }
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl under login. Prøv igen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30 animate-ping`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 shadow-2xl border-0 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"></div>
          
          <CardHeader className="text-center pb-2 relative z-10">
            {/* Logo placeholder with 3D effect */}
            <div className="mx-auto w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl transform rotate-3 shadow-xl"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
              SVL Sportsterapi
            </CardTitle>
            <p className="text-gray-600 font-medium">Velkommen tilbage</p>
            <div className="flex items-center justify-center space-x-1 mt-2 text-xs text-gray-500">
              <Sparkles className="w-3 h-3" />
              <span>Powered by modern design</span>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-4 pr-4 bg-white/90 border-gray-200/50 rounded-xl shadow-sm focus:shadow-lg focus:border-blue-400 transition-all duration-300 group-hover:shadow-md"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                <div className="relative group">
                  <Input
                    type="password"
                    placeholder="Adgangskode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-4 pr-4 bg-white/90 border-gray-200/50 rounded-xl shadow-sm focus:shadow-lg focus:border-blue-400 transition-all duration-300 group-hover:shadow-md"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <LogIn className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">
                  {loading ? "Logger ind..." : "Log ind"}
                </span>
              </Button>
            </form>
            
            {/* Jama Consulting branding */}
            <div className="mt-8 pt-4 border-t border-gray-200/50 text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-sm flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">J</span>
                </div>
                <span>Udviklet af Jama Consulting</span>
                <div className="flex items-center space-x-1 text-[10px] bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                  <Sparkles className="w-2 h-2 text-green-500" />
                  <span>v2.0</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
