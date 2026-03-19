'use client';
import QRCode from "qrcode";
import dynamic from 'next/dynamic';
import fetchAppointments from '../../hooks/useFetchAppointments';
import { useState, useEffect } from 'react';
import { Appointment, Notification } from '../../types/types';
import NewAppointment from '../../components/NewAppointment';
import NotificationManager from '../../components/NotificationManager';

const AdminCalendar = dynamic(() => import('../../components/AdminCalendar'), {
  ssr: false,
  loading: () => <div className="h-screen flex items-center justify-center"><p>Nalaganje koledarja...</p></div>,
});

export default function AdminPage() {
  const [clientAppointments, setClientAppointments] = useState<Appointment[]>([]);
  const [availableAppointments, setAvailableAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [icalToken, setIcalToken] = useState("");
  const [icalUrl, setIcalUrl] = useState("");
  const [icalCopied, setIcalCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testEmailStatus, setTestEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const storedToken = sessionStorage.getItem("adminIcalToken");
    if (storedToken) {
      setIcalToken(storedToken);
      setIcalUrl(`${window.location.origin}/api/admin/ical?token=${storedToken}`);
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    if (!icalUrl) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(icalUrl, {
      width: 220,
      margin: 2,
    })
      .then((url) => {
        if (isActive) setQrDataUrl(url);
      })
      .catch((error) => {
        console.error("Failed to generate QR code:", error);
        if (isActive) setQrDataUrl("");
      });

    return () => {
      isActive = false;
    };
  }, [icalUrl]);

  // Fetch appointments and notifications on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const appointmentData = await fetchAppointments();
        if (appointmentData) {
          setClientAppointments(appointmentData.bookedAppointments as Appointment[]);
          setAvailableAppointments(appointmentData.availableAppointments);
        } else {
          setFetchError(true);
        }

        // Fetch notifications from API
        const notificationsRes = await fetch('/api/notifications', {
          credentials: 'include',
        });
        if (notificationsRes.ok) {
          const notificationsData = await notificationsRes.json();
          setNotifications(notificationsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleIcalTokenSave = () => {
    const trimmed = icalToken.trim();
    if (!trimmed) {
      setIcalUrl("");
      sessionStorage.removeItem("adminIcalToken");
      return;
    }
    sessionStorage.setItem("adminIcalToken", trimmed);
    setIcalUrl(`${window.location.origin}/api/admin/ical?token=${trimmed}`);
    setIcalCopied(false);
  };

  const handleCopyIcalUrl = async () => {
    if (!icalUrl) return;
    try {
      await navigator.clipboard.writeText(icalUrl);
      setIcalCopied(true);
      setTimeout(() => setIcalCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy iCal URL:", error);
    }
  };

  const handleSendTestEmail = async () => {
    try {
      setTestEmailStatus("sending");
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: testEmail }),
      });
      if (!response.ok) {
        throw new Error("Failed to send test email");
      }
      setTestEmailStatus("sent");
    } catch (error) {
      console.error("Test email failed:", error);
      setTestEmailStatus("error");
    }
  };

  const handleAddNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        const newNotification = await response.json();
        setNotifications([newNotification, ...notifications]);
      }
    } catch (error) {
      console.error('Error adding notification:', error);
      alert('Napaka pri dodajanju obvestila');
    }
  };

  const handleUpdateNotification = async (id: string, updatedData: Partial<Notification>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...updatedData }),
      });

      if (response.ok) {
        const updatedNotification = await response.json();
        setNotifications(notifications.map(n => 
          n.id === id ? updatedNotification : n
        ));
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      alert('Napaka pri posodabljanju obvestila');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Ste prepričani, da želite izbrisati to obvestilo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Napaka pri brisanju obvestila');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Nalaganje...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 text-lg">Napaka pri nalaganju podatkov. Preverite, ali ste prijavljeni kot admin.</p>
        <button
          className="button px-4 py-2"
          onClick={() => window.location.reload()}
        >
          Poskusi znova
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <div className="w-full bg-white rounded-lg shadow-sm p-4 border">
        <h2 className="text-lg font-semibold mb-2">Admin iCal povezava</h2>
        <p className="text-sm text-gray-600 mb-3">
          Vnesi skrivni iCal ključ in se naroči na koledar v Apple/Google Calendar.
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="password"
            value={icalToken}
            onChange={(e) => setIcalToken(e.target.value)}
            placeholder="ADMIN_ICAL_TOKEN"
            className="border rounded px-3 py-2 w-full md:max-w-sm"
          />
          <button
            onClick={handleIcalTokenSave}
            className="button px-4 py-2"
            type="button"
          >
            Ustvari povezavo
          </button>
        </div>
        {icalUrl && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="text-sm break-all">{icalUrl}</div>
            <button
              onClick={handleCopyIcalUrl}
              className="button px-4 py-2 w-fit"
              type="button"
            >
              {icalCopied ? "Kopirano" : "Kopiraj povezavo"}
            </button>
            <p className="text-xs text-gray-500">
              Apple Calendar: File → New Calendar Subscription. Google Calendar: Add by URL.
            </p>
            {qrDataUrl && (
              <div className="mt-2 flex flex-col items-start gap-2">
                <div className="text-xs text-gray-500">QR za hitro naročnino:</div>
                <img
                  src={qrDataUrl}
                  alt="Admin iCal QR"
                  className="h-[220px] w-[220px] border rounded bg-white p-2"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm p-4 border">
        <h2 className="text-lg font-semibold mb-2">Test email</h2>
        <p className="text-sm text-gray-600 mb-3">
          Pošlji testno potrditev termina na poljuben email (pusti prazno za default `EMAIL_USER`).
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
            className="border rounded px-3 py-2 w-full md:max-w-sm"
          />
          <button
            onClick={handleSendTestEmail}
            className="button px-4 py-2"
            type="button"
            disabled={testEmailStatus === "sending"}
          >
            {testEmailStatus === "sending" ? "Pošiljam..." : "Pošlji test email"}
          </button>
        </div>
        {testEmailStatus === "sent" && (
          <div className="text-sm text-green-600 mt-2">Email poslan.</div>
        )}
        {testEmailStatus === "error" && (
          <div className="text-sm text-red-600 mt-2">Pošiljanje ni uspelo.</div>
        )}
      </div>

      {/* Notification Management Section */}
      <div className="w-full">
        <NotificationManager
          notifications={notifications}
          onAdd={handleAddNotification}
          onUpdate={handleUpdateNotification}
          onDelete={handleDeleteNotification}
        />
      </div>

      {/* Main Admin Content */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
        <div className='h-auto'>
          <NewAppointment />
        </div>
        <div className="mt-4 md:mt-0 h-screen">  
          <AdminCalendar 
            clientAppointments={clientAppointments} 
            availableAppointments={availableAppointments} 
          />
        </div>
      </div>
    </div>
  );
}
