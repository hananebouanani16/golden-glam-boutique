
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, MessageSquare } from "lucide-react";
import { saveRating, getRatings, getAverageRating, getRatingCount } from "@/utils/ratingsUtils";
import { toast } from "sonner";

interface RatingComponentProps {
  productId: string;
  productTitle: string;
}

const RatingComponent = ({ productId, productTitle }: RatingComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const averageRating = getAverageRating(productId);
  const ratingCount = getRatingCount(productId);
  const ratings = getRatings(productId);

  const handleSubmitRating = () => {
    if (selectedRating === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }

    saveRating(productId, selectedRating, comment);
    toast.success("Votre évaluation a été enregistrée !");
    
    setSelectedRating(0);
    setComment("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* Affichage de la note moyenne */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${
                i < Math.floor(averageRating) 
                  ? 'text-gold-400 fill-current' 
                  : 'text-gray-400'
              }`} 
            />
          ))}
        </div>
        <span className="text-sm text-gold-400">
          {averageRating.toFixed(1)} ({ratingCount} avis)
        </span>
      </div>

      {/* Bouton pour ouvrir le dialogue d'évaluation */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gold-border text-gold-300 hover:bg-gold-500/10">
            <Star className="h-4 w-4 mr-1" />
            Noter ce produit
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gold-500/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="gold-text">Évaluer "{productTitle}"</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Sélection de la note */}
            <div>
              <p className="text-sm text-gray-300 mb-2">Votre note :</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-colors"
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        star <= (hoverRating || selectedRating)
                          ? 'text-gold-400 fill-current' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Commentaire optionnel */}
            <div>
              <p className="text-sm text-gray-300 mb-2">Commentaire (optionnel) :</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce produit..."
                className="bg-gray-800 border-gold-500/20 text-white"
                rows={3}
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-2">
              <Button onClick={handleSubmitRating} className="gold-button flex-1">
                Envoyer l'évaluation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="border-gold-500/20 text-gold-300"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Affichage des commentaires récents */}
      {ratings.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gold-300 hover:text-gold-200 p-0 h-auto">
              <MessageSquare className="h-3 w-3 mr-1" />
              Voir les avis ({ratings.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gold-500/20 text-white max-w-2xl max-h-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="gold-text">Avis clients - {productTitle}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {ratings.slice(-10).reverse().map((rating, index) => (
                <div key={index} className="border-b border-gold-500/20 pb-3 last:border-b-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < rating.rating 
                              ? 'text-gold-400 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(rating.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-300">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RatingComponent;
