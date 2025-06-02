
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Mail, Building2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Login fejl",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Velkommen",
          description: "Du er nu logget ind",
        });
        onLogin();
      }
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl under login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: signupData.name
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
          title: "Registrering gennemført",
          description: "Check din email for at bekræfte din konto",
        });
      }
    } catch (error) {
      toast({
        title: "Uventet fejl",
        description: "Der opstod en fejl under registrering",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">SVL Sportsterapi</CardTitle>
            <p className="text-blue-200 text-lg">Medarbejder Portal</p>
          </CardHeader>
          
          <CardContent className="pb-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
                <TabsTrigger value="login" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200">
                  Log ind
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200">
                  Opret konto
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                      <Input
                        type="email"
                        placeholder="Email adresse"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 focus:bg-white/15 transition-all"
                        required
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                      <Input
                        type="password"
                        placeholder="Adgangskode"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 focus:bg-white/15 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                    disabled={loading}
                  >
                    {loading ? "Logger ind..." : "Log ind"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <User className="absolute left-4 top-4 h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                      <Input
                        type="text"
                        placeholder="Fulde navn"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 focus:bg-white/15 transition-all"
                        required
                      />
                    </div>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                      <Input
                        type="email"
                        placeholder="Email adresse"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 focus:bg-white/15 transition-all"
                        required
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                      <Input
                        type="password"
                        placeholder="Adgangskode"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 focus:bg-white/15 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                    disabled={loading}
                  >
                    {loading ? "Opretter..." : "Opret konto"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer with company credit */}
        <div className="mt-8 text-center">
          <p className="text-blue-200/70 text-sm">
            Udviklet af <span className="font-semibold text-blue-200">Jama Consulting</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
