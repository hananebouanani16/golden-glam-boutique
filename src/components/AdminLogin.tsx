
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastAttemptTime = useRef<number>(0);
  const { login } = useAuth();

  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  const MIN_DELAY_BETWEEN_ATTEMPTS = 2000; // 2 secondes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur est bloqué
    if (isBlocked) {
      toast.error("Trop de tentatives. Veuillez attendre 15 minutes.");
      return;
    }

    // Vérifier le délai minimum entre les tentatives
    const now = Date.now();
    if (now - lastAttemptTime.current < MIN_DELAY_BETWEEN_ATTEMPTS) {
      toast.error("Veuillez attendre avant de réessayer.");
      return;
    }

    // Validation du mot de passe
    if (!password || password.trim().length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);
    lastAttemptTime.current = now;

    // Délai artificiel pour ralentir les attaques par force brute
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (login(password)) {
        toast.success("Connexion réussie !");
        setAttempts(0);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= MAX_ATTEMPTS) {
          setIsBlocked(true);
          toast.error(`Trop de tentatives incorrectes. Accès bloqué pendant 15 minutes.`);
          
          // Débloquer après 15 minutes
          setTimeout(() => {
            setIsBlocked(false);
            setAttempts(0);
          }, BLOCK_DURATION);
        } else {
          toast.error(`Mot de passe incorrect (${newAttempts}/${MAX_ATTEMPTS} tentatives)`);
        }
        
        setPassword("");
      }
    } catch (error) {
      toast.error("Erreur de connexion. Veuillez réessayer.");
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
            Accès réservé au propriétaire
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
                placeholder="Entrez le mot de passe"
                required
                disabled={isBlocked || isLoading}
                minLength={6}
                autoComplete="current-password"
              />
              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                <p className="text-red-400 text-sm">
                  {MAX_ATTEMPTS - attempts} tentative(s) restante(s)
                </p>
              )}
              {isBlocked && (
                <p className="text-red-500 text-sm">
                  Accès temporairement bloqué pour des raisons de sécurité
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold"
              disabled={isBlocked || isLoading}
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
