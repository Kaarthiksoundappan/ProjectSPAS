import { MapPin, Clock, Phone, Mail, ChevronRight } from "lucide-react";

const OPENING_HOURS = [
  { day: "Monday",    open: "8:00 AM", close: "9:00 PM" },
  { day: "Tuesday",   open: "8:00 AM", close: "9:00 PM" },
  { day: "Wednesday", open: "8:00 AM", close: "9:00 PM" },
  { day: "Thursday",  open: "8:00 AM", close: "9:00 PM" },
  { day: "Friday",    open: "8:00 AM", close: "10:00 PM" },
  { day: "Saturday",  open: "7:00 AM", close: "10:00 PM" },
  { day: "Sunday",    open: "9:00 AM", close: "8:00 PM" },
];

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

export default function StorePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Store Information</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Location */}
        <div className="card p-6 space-y-4" id="location">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-100">
              <MapPin className="h-5 w-5 text-brand-green-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Location</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            SPAS Super Store
            <br />
            View our full address on Google Maps
          </p>
          <a
            href="https://maps.app.goo.gl/wUfHXHs8LzEx6WXdA"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex gap-2 text-sm"
          >
            <MapPin className="h-4 w-4" />
            Open in Google Maps
            <ChevronRight className="h-4 w-4" />
          </a>

          {/* Embedded map */}
          <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSPAS+Super+Store!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SPAS Super Store location"
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="card p-6 space-y-4" id="hours">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-100">
              <Clock className="h-5 w-5 text-brand-green-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Opening Hours</h2>
          </div>
          <ul className="space-y-2">
            {OPENING_HOURS.map((h) => {
              const isToday = h.day === today;
              return (
                <li
                  key={h.day}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    isToday ? "bg-brand-green-50 font-semibold text-brand-green-800" : "text-gray-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {h.day}
                    {isToday && (
                      <span className="badge-green text-xs">Today</span>
                    )}
                  </span>
                  <span>
                    {h.open} – {h.close}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Contact */}
        <div className="card p-6 space-y-4 sm:col-span-2" id="contact">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-100">
              <Phone className="h-5 w-5 text-brand-green-600" />
            </div>
            <h2 className="font-semibold text-gray-900">Contact Us</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4 space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
              <a href="tel:+1" className="text-brand-green-700 font-medium hover:underline">
                Contact via store
              </a>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
              <a href="mailto:info@spasstore.com" className="text-brand-green-700 font-medium hover:underline">
                info@spasstore.com
              </a>
            </div>
          </div>

          {/* Contact form */}
          <form className="space-y-4 mt-2">
            <h3 className="font-medium text-gray-900">Send us a message</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="input" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="input" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={4}
                className="input resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button type="submit" className="btn-primary">
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
