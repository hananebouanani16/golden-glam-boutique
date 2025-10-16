import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";
import { validateEmail, sanitizeInput } from "@/utils/securityUtils";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des entrées
    const sanitizedEmail = sanitizeInput(email);
    
    if (!validateEmail(sanitizedEmail)) {
      toast.error("Email invalide");
      return;
    }

    if (!password || password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);

    try {
      await signIn(sanitizedEmail, password);
      toast.success("Connexion réussie !");
    } catch (error: any) {
      toast.error(error.message || "Email ou mot de passe incorrect");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gold-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gold-text">Administration</CardTitle>
          <CardDescription className="text-gray-400">
            Connexion sécurisée requise
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gold-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gold-500/30 text-white"
                placeholder="admin@example.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gold-300">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gold-500/30 text-white"
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={8}
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
