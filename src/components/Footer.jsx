import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/starconnect-logo.png"
                alt="StarConnect"
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
              />
            </div>
            <p className="text-foreground/60 text-sm">
              Connect with your favorite celebrities and create memorable experiences.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span to="/browse" className="text-foreground/60 hover:text-foreground transition">
                  Browse Celebrities
                </span>
              </li>
              <li>
                <span to="/how-it-works" className="text-foreground/60 hover:text-foreground transition">
                  How It Works
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span to="/about" className="text-foreground/60 hover:text-foreground transition">
                  About Us
                </span>
              </li>
              <li>
                {/* Blog link - non-clickable */}
                <span className="text-foreground/40 cursor-default">
                  Blog
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                {/* Privacy Policy - non-clickable */}
                <span className="text-foreground/40 cursor-default">
                  Privacy Policy
                </span>
              </li>
              <li>
                {/* Terms of Service - non-clickable */}
                <span className="text-foreground/40 cursor-default">
                  Terms of Service
                </span>
              </li>
              <li>
                {/* Contact - non-clickable */}
                <span className="text-foreground/40 cursor-default">
                  Contact
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Admin Login Link */}
            <a
              href="/admin-login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-foreground/40 hover:text-secondary transition group"
              title="Admin Login"
            >
              <Shield className="w-4 h-4 group-hover:scale-110 transition" />
             
            </a>
            
            {/* Copyright */}
            <p className="text-center text-foreground/60 text-sm">
              © 2020 StarConnect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}