'use client';

import { useState } from 'react';
import { PAYMENT_METHODS } from '@/lib/data';
import * as Dialog from '@radix-ui/react-dialog';

export default function BookingForm({ celebrity, onSubmit, loading }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('1');
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleNext = () => {
    if (step === 1 && date && time) {
      setStep(2);
    } else if (step === 2 && paymentMethod && agreedToTerms) {
      onSubmit({ date, time, paymentMethod, notes });
    }
  };

  const isStep1Valid = date && time;
  const isStep2Valid = paymentMethod && agreedToTerms;

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  // Get next 7 days
  const getNextDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2].map(s => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition ${
              s <= step ? 'bg-secondary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Date & Time */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Select Date</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {getNextDates().map((d, idx) => {
                const dateStr = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const day = d.getDate();

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDate(dateStr)}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      date === dateStr
                        ? 'border-secondary bg-secondary text-primary'
                        : 'border-border hover:border-secondary'
                    }`}
                  >
                    <div className="text-xs font-semibold text-foreground/60">{dayName}</div>
                    <div className="text-lg font-bold">{day}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Select Time</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`px-3 py-2 rounded-lg border-2 transition font-medium text-sm ${
                    time === slot
                      ? 'border-secondary bg-secondary text-primary'
                      : 'border-border hover:border-secondary'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-foreground/70">
              <span className="font-semibold">Session Duration:</span> 30 minutes
            </p>
            <p className="text-sm text-foreground/70">
              <span className="font-semibold">Price:</span> ${celebrity.price}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isStep1Valid}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id.toString())}
                  className={`w-full p-4 rounded-lg border-2 transition text-left ${
                    paymentMethod === method.id.toString()
                      ? 'border-secondary bg-secondary/10'
                      : 'border-border hover:border-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{method.type}</p>
                      <p className="text-sm text-foreground/60">{method.name}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      paymentMethod === method.id.toString()
                        ? 'border-secondary bg-secondary'
                        : 'border-border'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special topics or requests?"
              rows="4"
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="text-foreground/70">
              <span className="font-semibold">Date & Time:</span> {date} at {time}
            </p>
            <p className="text-foreground/70">
              <span className="font-semibold">Celebrity:</span> {celebrity.name}
            </p>
            <p className="text-lg font-bold text-foreground pt-2 border-t border-border">
              Total: ${celebrity.price}
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-foreground/70">
              I agree to the booking terms and cancellation policy. By booking, I confirm this connection is for personal use only.
            </span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 border-2 border-border text-foreground rounded-lg hover:bg-muted transition font-semibold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStep2Valid || loading}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
