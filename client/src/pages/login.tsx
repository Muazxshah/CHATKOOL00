import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { setAuthToken } from "@/lib/auth";
import { loginSchema, type LoginData } from "@shared/schema";
import RegistrationModal from "@/components/registration-modal";

export default function Login() {
  const [showRegistration, setShowRegistration] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      window.location.href = '/chat';
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue to-accent-purple flex items-center justify-center px-4">
      <Card className="w-full max-w-md" data-testid="login-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://www.chatkool.com/static/media/mainlogo.680cdbd559a984017e33.png" 
              alt="ChatKOOL Logo" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-dark-text" data-testid="text-login-title">
            Welcome Back
          </CardTitle>
          <CardDescription data-testid="text-login-description">
            Sign in to your ChatKOOL account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-login">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@university.edu.ph"
                {...form.register("email")}
                data-testid="input-email"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive" data-testid="error-email">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                data-testid="input-password"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive" data-testid="error-password">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary-blue hover:bg-blue-600"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="link"
                onClick={() => setShowRegistration(true)}
                className="text-neutral-gray hover:text-dark-text"
                data-testid="button-show-registration"
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <RegistrationModal 
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </div>
  );
}
