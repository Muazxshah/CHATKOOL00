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
      <DialogContent className="max-w-md border-0 bg-white/95 backdrop-blur-lg shadow-2xl" data-testid="username-modal">
        <DialogHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-testid="text-username-title">
            🎉 Enter ChatKOOL
          </DialogTitle>
          <p className="text-gray-600 leading-relaxed" data-testid="text-username-description">
            🎓 Choose a username to start chatting with fellow Filipino students
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" data-testid="form-username">
          <div className="space-y-3">
            <Label htmlFor="username" className="text-gray-700 font-medium">👤 Username</Label>
            <Input
              id="username"
              placeholder="✨ Enter your username"
              {...form.register("username")}
              className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl bg-gray-50 focus:bg-white transition-colors h-12"
              data-testid="input-username"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500" data-testid="error-username">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="university" className="text-gray-700 font-medium">🎓 University (Optional)</Label>
            <Select onValueChange={(value) => form.setValue("university", value)} data-testid="select-university">
              <SelectTrigger className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl bg-gray-50 focus:bg-white transition-colors h-12">
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
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white border-0 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            data-testid="button-enter-chat"
          >
            🚀 Enter Chat
          </Button>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            🔒 By entering, you confirm you're 18+ and agree to our community guidelines
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}