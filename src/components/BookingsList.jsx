import { Link } from 'react-router-dom';
import { getBookings, getCelebrityById } from '@/lib/data';

export default function BookingsList({ userId }) {
  const bookings = getBookings(userId);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-700';
      case 'Confirmed':
        return 'bg-green-500/20 text-green-700';
      case 'Completed':
        return 'bg-blue-500/20 text-blue-700';
      case 'Rejected':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-foreground/60';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-foreground/60 mb-4">No bookings yet</p>
        <Link
          to="/browse"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition inline-block"
        >
          Browse Celebrities
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div key={booking.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4 flex-1">
              {/* Celebrity Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                {(() => {
                  const celeb = getCelebrityById(booking.celebrityId);
                  return celeb ? (
                    <img
                      src={celeb.image}
                      alt={booking.celebrityName}
                      className="w-full h-full object-cover"
                    />
                  ) : null;
                })()}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground mb-1">{booking.celebrityName}</h3>
                <p className="text-sm text-foreground/60">
                  📅 {booking.date} at {booking.time}
                </p>
                <p className="text-sm text-foreground/60 mt-1">
                  Booking ID: {booking.id}
                </p>
                {booking.notes && (
                  <p className="text-sm text-foreground/70 mt-2 italic">
                    "{booking.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Status & Price */}
            <div className="flex flex-col items-end gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
              <p className="font-bold text-lg text-secondary">
                ${getCelebrityById(booking.celebrityId)?.price || '0'}
              </p>
            </div>
          </div>

          {booking.status === 'Confirmed' && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-700">
              Your meeting link will be sent 24 hours before the scheduled time
            </div>
          )}

          {booking.status === 'Pending' && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-700">
              Waiting for celebrity confirmation. You will be notified once confirmed.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}