
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  userRole?: string;
}

const Header = ({ onLogout, userRole }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {/* SVL Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/35855169-50b3-44b1-b946-9b48a81401a0.png" 
                alt="SVL Coaching" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">SVL Coaching</h1>
                <p className="text-sm text-gray-600">
                  {userRole === 'admin' ? 'Admin Dashboard' : 'Medarbejder Dashboard'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Jama Consulting Credit */}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Udviklet af</span>
              <img 
                src="/lovable-uploads/fe45f5d4-81d7-412e-b4be-7125f2ff602b.png" 
                alt="Jama Consulting" 
                className="h-8 w-auto opacity-60"
              />
            </div>
            
            <Button 
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log ud</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
