import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import RegisterForm from '../../components/auth/RegisterForm';
import Icon from '../../components/AppIcon';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Icon name="UserPlus" size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Join us to get started with your shopping experience</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <RegisterForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;