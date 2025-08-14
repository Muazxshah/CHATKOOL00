import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userEntrySchema, type UserEntry } from "@shared/schema";

interface UsernameModalProps {
  isOpen: boolean;
  onSubmit: (data: UserEntry) => void;
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

export default function UsernameModal({ isOpen, onSubmit }: UsernameModalProps) {
  const form = useForm<UserEntry>({
    resolver: zodResolver(userEntrySchema),
    defaultValues: {
      username: "",
      university: undefined,
    }
  });

  const handleSubmit = (data: UserEntry) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" data-testid="username-modal">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://www.chatkool.com/static/media/mainlogo.680cdbd559a984017e33.png" 
              alt="ChatKOOL Logo" 
              className="h-12 w-auto"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-dark-text" data-testid="text-username-title">
            Enter ChatKOOL
          </DialogTitle>
          <p className="text-neutral-gray" data-testid="text-username-description">
            Choose a username to start chatting with fellow Filipino students
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="form-username">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
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
            <Label htmlFor="university">University (Optional)</Label>
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
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary-blue hover:bg-blue-600"
            data-testid="button-enter-chat"
          >
            Enter Chat
          </Button>

          <p className="text-xs text-neutral-gray text-center">
            By entering, you confirm you're 18+ and agree to our community guidelines
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}