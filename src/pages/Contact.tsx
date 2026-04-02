import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Bug, Lightbulb, Send, CheckCircle2, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const contactTypes = [
  { id: 'problem', label: 'Report a Problem', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'bug', label: 'Report a Bug', icon: Bug, color: 'text-red-600', bg: 'bg-red-100' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-brand-600', bg: 'bg-brand-100' },
  { id: 'other', label: 'General Feedback', icon: Mail, color: 'text-slate-600', bg: 'bg-slate-100' },
];

export default function Contact() {
  const [type, setType] = useState('problem');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to a backend or use an email service
    // For now, we'll simulate a success state
    setSubmitted(true);
    
    // Construct mailto link as a fallback/direct option
    const subject = `[ExamPixl ${type.toUpperCase()}] from ${formData.name}`;
    const body = `Type: ${type}\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const mailtoUrl = `mailto:exampixl590@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // We don't automatically open mailto on submit to avoid interrupting the success UI
    // but we could provide a button for it if needed.
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-2xl shadow-brand-500/20 border border-slate-200"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="w-24 h-24 bg-gradient-to-br from-brand-100 to-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Message Sent!</h2>
          <p className="text-slate-700 mb-12 leading-relaxed font-medium">
            Thank you for reaching out. We've received your <span className="font-bold text-brand-600">{type}</span> and will get back to you as soon as possible at <span className="font-bold text-brand-600">{formData.email}</span>.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-600/40 transition-all shadow-lg shadow-brand-600/30"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-28">
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">Connect to Us</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Have a problem, found a bug, or want to request a new feature? We're all ears. 
            Help us make ExamPixl better for everyone.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-300/20"
          >
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] mb-8">Direct Contact</h3>
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 shadow-md">
                <Mail size={28} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Us</p>
                <a href="mailto:exampixl590@gmail.com" className="text-sm font-black text-slate-900 hover:text-brand-600 transition-colors">
                  exampixl590@gmail.com
                </a>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              We typically respond within 24-48 hours. For urgent issues, please use the form for faster categorization.
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.form 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="bg-white rounded-3xl p-10 md:p-14 border border-slate-200 shadow-2xl shadow-slate-300/30 space-y-10"
          >
            <div className="space-y-5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] block">What's on your mind?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {contactTypes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-3 font-semibold",
                      type === item.id 
                        ? "border-brand-500 bg-brand-50 shadow-lg shadow-brand-500/15 text-brand-700" 
                        : "border-slate-200 hover:border-brand-300 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <item.icon size={22} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
                      {item.label.split(' ')[1] || item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] ml-1 block">Your Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] ml-1 block">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] ml-1 block">Message</label>
              <textarea 
                required
                rows={6}
                placeholder="Tell us more about it..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold text-slate-900 resize-none placeholder:text-slate-400"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-brand-600/40 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-600/30"
            >
              <Send size={20} strokeWidth={1.5} />
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
