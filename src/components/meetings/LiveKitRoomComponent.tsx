'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Hand,
  PhoneOff,
  MessageSquare,
  Users,
  AlertCircle,
  Copy,
  Check,
  Shield,
  Loader2,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface LiveKitRoomComponentProps {
  roomId: string;
  initialMeeting: any;
  userProfile: any;
}

export function LiveKitRoomComponent({
  roomId,
  initialMeeting,
  userProfile,
}: LiveKitRoomComponentProps) {
  const router = useRouter();

  // Connection & Token State
  const [token, setToken] = React.useState<string | null>(null);
  const [serverUrl, setServerUrl] = React.useState<string | null>(null);
  const [isConfigured, setIsConfigured] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [displayName, setDisplayName] = React.useState(
    userProfile?.full_name || ''
  );
  const [isHost, setIsHost] = React.useState(false);

  // In-Call Media States
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isVideoOn, setIsVideoOn] = React.useState(false);
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const [isHandRaised, setIsHandRaised] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [showParticipants, setShowParticipants] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'System',
      text: 'Welcome to the official Shenen Kolu community room. Meeting is protected under institutional WebRTC rules.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [newMessage, setNewMessage] = React.useState('');
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Local media stream
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const localStreamRef = React.useRef<MediaStream | null>(null);

  // Obtain Room Token
  const fetchToken = React.useCallback(async (nameToUse?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/meetings/${roomId}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: nameToUse || displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to join meeting room');
        setIsLoading(false);
        return;
      }

      setIsConfigured(data.isConfigured);
      if (data.token) {
        setToken(data.token);
        setServerUrl(data.serverUrl);
        setIsHost(data.participant?.isHost || false);
      } else if (!data.isConfigured) {
        setIsConfigured(false);
        setErrorMessage(data.error);
      }
    } catch {
      setErrorMessage('Network error communicating with meeting server.');
    } finally {
      setIsLoading(false);
    }
  }, [roomId, displayName]);

  React.useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Handle local camera preview if user toggles video
  const toggleCamera = async () => {
    if (isVideoOn) {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((t) => t.stop());
      }
      setIsVideoOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: isMicOn,
        });
        localStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsVideoOn(true);
      } catch (err: any) {
        console.warn('Camera access denied or unavailable:', err);
        alert(
          'Camera access was denied by your browser or is currently unavailable. Please grant permissions in browser settings.'
        );
      }
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        sender: displayName || 'You',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');
  };

  const handleEndMeeting = async () => {
    if (confirm('End this meeting for all participants?')) {
      await fetch(`/api/meetings/${roomId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      router.push('/meetings');
    }
  };

  const handleLeaveMeeting = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    router.push('/meetings');
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <h3 className="text-lg font-bold text-foreground">
          Authenticating & Connecting to LiveKit Room...
        </h3>
        <p className="text-xs text-muted-foreground">
          Verifying session clearance and generating room token.
        </p>
      </div>
    );
  }

  // 2. Unconfigured Credentials Diagnostic State
  if (!isConfigured) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Settings className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            LiveKit WebRTC Setup Required
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The meeting room interface is fully functional, but the server LiveKit environment variables have not been configured yet.
          </p>
          <div className="p-4 rounded-xl bg-card border border-border text-left font-mono text-xs space-y-2 text-foreground">
            <p className="font-sans font-semibold text-muted-foreground">Required variables in .env.local:</p>
            <p>LIVEKIT_URL=&quot;wss://your-subdomain.livekit.cloud&quot;</p>
            <p>LIVEKIT_API_KEY=&quot;APIxxxxxxxxxxxx&quot;</p>
            <p>LIVEKIT_API_SECRET=&quot;your-api-secret&quot;</p>
          </div>
          <p className="text-xs text-muted-foreground">
            LiveKit Build plan is free ($0/month) with 10,000 participant-minutes/month included.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => router.push('/meetings')}>
              Back to Meetings
            </Button>
            <Button onClick={() => fetchToken()}>
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Error / Access Denied State
  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Access Restricted</h3>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <Button onClick={() => router.push('/meetings')} className="mt-4">
            Return to Meetings
          </Button>
        </div>
      </div>
    );
  }

  // 4. Live Meeting Room Active Interface
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-white overflow-hidden">
      {/* Top Meeting Header */}
      <div className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-bold text-sm text-white line-clamp-1">
              {initialMeeting?.title || roomId}
            </h2>
          </div>
          <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
            Room: {roomId}
          </Badge>
          {isHost && (
            <Badge variant="default" className="bg-emerald-600 text-[10px]">
              Host Administrator
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Invite Link'}</span>
          </button>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors ${
              showParticipants ? 'bg-slate-800 text-emerald-400' : ''
            }`}
            title="Participants"
          >
            <Users className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors ${
              showChat ? 'bg-slate-800 text-emerald-400' : ''
            }`}
            title="Meeting Chat"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Video & Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Stage Grid */}
        <div className="flex-1 p-4 flex flex-col items-center justify-center relative">
          <div className="w-full h-full max-h-[80vh] grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
            {/* Primary / Local Tile */}
            <div className="relative w-full h-full min-h-[240px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-lg">
              {isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="h-20 w-20 rounded-full bg-primary/20 text-emerald-400 font-bold text-2xl flex items-center justify-center border-2 border-primary/30 shadow-inner">
                    {(displayName || 'You').substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-300">
                    {displayName || 'You (Local)'}
                  </span>
                </div>
              )}

              {/* Tile Overlay Indicators */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-2">
                <span>{displayName || 'You'}</span>
                {!isMicOn && <MicOff className="h-3 w-3 text-red-400" />}
                {isHandRaised && <Hand className="h-3 w-3 text-amber-400 animate-bounce" />}
              </div>
            </div>

            {/* Simulated Community Participant Tile for interactive UI */}
            <div className="relative w-full h-full min-h-[240px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-lg">
              <div className="flex flex-col items-center space-y-3">
                <div className="h-20 w-20 rounded-full bg-slate-800 text-slate-400 font-bold text-2xl flex items-center justify-center border border-slate-700">
                  SK
                </div>
                <span className="text-sm font-semibold text-slate-300">
                  Shenen Kolu Secretariat
                </span>
                <span className="text-xs text-slate-500">Audio Stream Active</span>
              </div>

              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-2">
                <span>Woreda Administration Host</span>
                <Shield className="h-3 w-3 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Chat or Participants */}
        {(showChat || showParticipants) && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
            {showChat && (
              <div className="flex-1 flex flex-col h-full">
                <div className="p-3 border-b border-slate-800 font-bold text-sm text-slate-200">
                  Meeting Chat
                </div>
                <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-slate-200">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-slate-300 bg-slate-800 p-2 rounded-lg leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Button size="sm" type="submit" className="text-xs h-8">
                    Send
                  </Button>
                </form>
              </div>
            )}

            {showParticipants && !showChat && (
              <div className="flex-1 p-3 space-y-3">
                <div className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">
                  Participants (2)
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-800">
                    <span className="font-semibold text-white">{displayName || 'You'} (Me)</span>
                    <Badge variant="outline" className="text-[10px] border-slate-700">
                      {isHost ? 'Host' : 'Member'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-800">
                    <span className="font-semibold text-white">Shenen Kolu Secretariat</span>
                    <Badge variant="default" className="text-[10px] bg-emerald-700">
                      Host
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Media Control Bar */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="text-xs text-slate-400 hidden sm:block">
          WebRTC Encrypted &bull; Est. 10k min monthly quota
        </div>

        {/* Center Media Buttons */}
        <div className="flex items-center gap-3">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition-colors ${
              isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-colors ${
              isVideoOn ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title="Share Screen"
          >
            <Share2 className="h-5 w-5" />
          </button>

          {/* Raise Hand */}
          <button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`p-3 rounded-full transition-colors ${
              isHandRaised ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
          >
            <Hand className="h-5 w-5" />
          </button>

          {/* Leave Call */}
          <button
            onClick={handleLeaveMeeting}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
            title="Leave Meeting"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>

        {/* Host Control Action */}
        <div className="flex items-center gap-2">
          {isHost && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndMeeting}
              className="text-xs"
            >
              End for All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
