import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toggleWishlist, isInWishlist, formatPrice } from '@/lib/data';
import { useState, useEffect } from 'react';

export default function CelebrityCard({ celebrity }) {
  const { user } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
      setInWishlist(isInWishlist(user.id, celebrity.id));
    }
  }, [user, celebrity.id]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleWishlist(user.id, celebrity.id);
      setInWishlist(!inWishlist);
    }
  };

  // Fallback image
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name)}&size=400&background=7C3AED&color=fff&bold=true`;

  return (
    <Link to={`/celebrity/${celebrity.id}`} className="group">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition duration-300">
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-muted">
          <img
            src={imageError ? fallbackImage : celebrity.image}
            alt={celebrity.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

          {/* Price Badge - FIXED: Use pricePerMinute */}
          <div className="absolute top-4 right-4 bg-secondary text-primary px-3 py-1 rounded-full text-sm font-semibold">
            {formatPrice(celebrity.price_per_minute)}/min
          </div>

          {/* Wishlist Button */}
          {user && (
            <button
              onClick={handleWishlist}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition z-10"
            >
              <span className={`text-lg ${inWishlist ? 'text-destructive' : 'text-foreground/40'}`}>
                ♥
              </span>
            </button>
          )}

          {/* Availability Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-block bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {celebrity.availability || 'Available'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 text-foreground">
            {celebrity.name}
          </h3>
          <p className="text-sm text-foreground/60 mb-2">{celebrity.category}</p>

          <p className="text-sm text-foreground/70 mb-4 line-clamp-2 h-10">
            {celebrity.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {celebrity.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs bg-muted px-2 py-1 rounded text-foreground/70">
                {tag}
              </span>
            ))}
          </div>

          {/* Rating and Reviews - FIXED: Use totalReviews */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-secondary font-bold">★</span>
              <span className="font-semibold text-sm">{celebrity.rating}</span>
              <span className="text-xs text-foreground/60">
                {celebrity.totalReviews || 0} reviews
              </span>
            </div>
            <span className="text-xs text-secondary font-semibold">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}