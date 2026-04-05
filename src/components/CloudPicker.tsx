import React, { useEffect } from 'react';
import { HardDrive, Box, Cloud } from 'lucide-react';

interface CloudPickerProps {
  onFileSelect: (file: File) => void;
  onLocalClick?: () => void;
  allowedTypes?: string[]; // e.g. ['.pdf', '.jpg', '.png']
}

declare global {
  interface Window {
    google: any;
    gapi: any;
    Dropbox: any;
  }
}

export default function CloudPicker({ onFileSelect, onLocalClick, allowedTypes = [] }: CloudPickerProps) {
  
  // Load Scripts
  useEffect(() => {
    // Google Drive
    if (!document.getElementById('google-picker-js')) {
      const script = document.createElement('script');
      script.id = 'google-picker-js';
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    if (!document.getElementById('google-gis-js')) {
      const script = document.createElement('script');
      script.id = 'google-gis-js';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Dropbox
    if (!document.getElementById('dropbox-js')) {
      const script = document.createElement('script');
      script.id = 'dropbox-js';
      script.src = 'https://www.dropbox.com/static/api/2/dropins.js';
      script.setAttribute('data-app-key', (import.meta as any).env.VITE_DROPBOX_APP_KEY || '');
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleDrive = async () => {
    const clientId = (import.meta as any).env.VITE_GOOGLE_DRIVE_CLIENT_ID;
    const apiKey = (import.meta as any).env.VITE_GOOGLE_DRIVE_API_KEY;

    if (!clientId || !apiKey) {
      alert('Google Drive integration requires Client ID and API Key. Please configure them in your environment.');
      return;
    }

    const loadPicker = () => {
      return new Promise((resolve) => {
        window.gapi.load('picker', { callback: resolve });
      });
    };

    const getAccessToken = () => {
      return new Promise((resolve, reject) => {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: (response: any) => {
            if (response.error !== undefined) {
              reject(response);
            }
            resolve(response.access_token);
          },
        });
        tokenClient.requestAccessToken();
      });
    };

    try {
      await loadPicker();
      const accessToken = await getAccessToken();
      
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(accessToken)
        .setDeveloperKey(apiKey)
        .setCallback(async (data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const doc = data.docs[0];
            const response = await fetch(`https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const blob = await response.blob();
            const file = new File([blob], doc.name, { type: blob.type });
            onFileSelect(file);
          }
        })
        .build();
      picker.setVisible(true);
    } catch (error) {
      // Silently fail for Google Drive errors
    }
  };

  const handleDropbox = () => {
    const appKey = (import.meta as any).env.VITE_DROPBOX_APP_KEY;
    if (!appKey) {
      alert('Dropbox integration requires an App Key. Please configure it in your environment.');
      return;
    }

    if (window.Dropbox) {
      window.Dropbox.choose({
        success: async (files: any) => {
          const fileData = files[0];
          const response = await fetch(fileData.link);
          const blob = await response.blob();
          const file = new File([blob], fileData.name, { type: blob.type });
          onFileSelect(file);
        },
        linkType: 'direct',
        multiselect: false,
        extensions: allowedTypes,
      });
    }
  };

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); handleGoogleDrive(); }}
        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all shadow-sm group/btn"
        title="Google Drive"
      >
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-brand-100 group-hover/btn:text-brand-600 transition-colors">
          <Cloud size={20} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-brand-600">Drive</span>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); handleDropbox(); }}
        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all shadow-sm group/btn"
        title="Dropbox"
      >
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-brand-100 group-hover/btn:text-brand-600 transition-colors">
          <Box size={20} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-brand-600">Dropbox</span>
      </button>
    </>
  );
}
