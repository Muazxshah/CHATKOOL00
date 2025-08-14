import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { setAuthToken } from "@/lib/auth";
import { insertUserSchema, type InsertUser } from "@shared/schema";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const universities = [
  { value: "University of the Philippines", label: "University of the Philippines" },
  { value: "Ateneo de Manila University", label: "Ateneo de Manila University" },
  { value: "University of Santo Tomas", label: "University of Santo Tomas" },
  { value: "De La Salle University", label: "De La Salle University" },
  { value: "Polytechnic University of the Philippines", label: "Polytechnic University of the Philippines" },
  { value: "Far Eastern University", label: "Far Eastern University" },
  { value: "University of the East", label: "University of the East" },
  { value: "Other", label: "Other" },
];

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      university: "",
      password: "",
      confirmPassword: "",
      ageConfirmation: false,
      termsAccepted: false,
    }
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      toast({
        title: "Welcome to ChatKOOL!",
        description: "Your account has been created successfully.",
      });
      onClose();
      window.location.href = '/chat';
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    registrationMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="registration-modal">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://www.chatkool.com/static/media/mainlogo.680cdbd559a984017e33.png" 
              alt="ChatKOOL Logo" 
              className="h-12 w-auto"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-dark-text" data-testid="text-registration-title">
            Join ChatKOOL
          </DialogTitle>
          <p className="text-neutral-gray" data-testid="text-registration-description">
            Connect with Filipino college students
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-registration">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Juan Dela Cruz"
              {...form.register("fullName")}
              data-testid="input-full-name"
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-destructive" data-testid="error-full-name">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="juandelacruz"
              {...form.register("username")}
              data-testid="input-username"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive" data-testid="error-username">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

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
            <Label htmlFor="university">University</Label>
            <Select onValueChange={(value) => form.setValue("university", value)} data-testid="select-university">
              <SelectTrigger>
                <SelectValue placeholder="Select your university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni.value} value={uni.value}>
                    {uni.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.university && (
              <p className="text-sm text-destructive" data-testid="error-university">
                {form.formState.errors.university.message}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...form.register("confirmPassword")}
              data-testid="input-confirm-password"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive" data-testid="error-confirm-password">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="ageConfirmation"
                checked={form.watch("ageConfirmation")}
                onCheckedChange={(checked) => form.setValue("ageConfirmation", checked as boolean)}
                data-testid="checkbox-age-confirmation"
              />
              <Label htmlFor="ageConfirmation" className="text-sm text-neutral-gray">
                I confirm that I am over 18 years old.
              </Label>
            </div>
            {form.formState.errors.ageConfirmation && (
              <p className="text-sm text-destructive" data-testid="error-age-confirmation">
                {form.formState.errors.ageConfirmation.message}
              </p>
            )}

            <div className="flex items-start space-x-3">
              <Checkbox
                id="termsAccepted"
                checked={form.watch("termsAccepted")}
                onCheckedChange={(checked) => form.setValue("termsAccepted", checked as boolean)}
                data-testid="checkbox-terms-accepted"
              />
              <Label htmlFor="termsAccepted" className="text-sm text-neutral-gray">
                I agree to ChatKOOL's terms and conditions.
              </Label>
            </div>
            {form.formState.errors.termsAccepted && (
              <p className="text-sm text-destructive" data-testid="error-terms-accepted">
                {form.formState.errors.termsAccepted.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary-blue hover:bg-blue-600"
            disabled={registrationMutation.isPending}
            data-testid="button-create-account"
          >
            {registrationMutation.isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
