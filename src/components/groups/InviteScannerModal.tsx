"client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Copy, QrCode, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { copyTextToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

export interface InviteScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScan: (codeOrUrl: string) => void;
}

export function InviteScannerModal({
  open,
  onClose,
  onScan,
}: InviteScannerModalProps) {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    if (!open) {
      stopCamera();
      setCameraError(null);
      setManualCode("");
    } else {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    setCameraError(null);
    setScanning(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not available on this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera permission denied or unavailable. Please use manual code entry or fallback copy options below."
      );
      setScanning(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    onScan(manualCode.trim());
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        stopCamera();
        onClose();
      }}
      title="Scan Group Invite QR"
      description="Scan a member invite QR code using your camera or enter the invite code manually."
    >
      <div className="space-y-4">
        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-3 border-ink bg-black/90 shadow-brutal">
          {cameraError ? (
            <div className="flex flex-col items-center p-6 text-center text-cream">
              <CameraOff className="mb-2 h-10 w-10 text-flamingo" />
              <p className="text-xs font-bold">{cameraError}</p>
              <Button
                size="sm"
                className="mt-4 border-2 border-cream bg-transparent text-cream hover:bg-cream/25"
                onClick={startCamera}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry Camera
              </Button>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}
          {scanning && !cameraError && (
            <div className="absolute inset-0 border-4 border-dashed border-lime/50 pointer-events-none animate-pulse" />
          )}
        </div>

        <div className="rounded-xl border-2 border-ink bg-cream p-4">
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <Label htmlFor="manual-invite-code">
              Or enter invite code / link manually
            </Label>
            <div className="flex gap-2">
              <Input
                id="manual-invite-code"
                placeholder="e.g. ABCD1234 or join URL"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <Button type="submit">
                Join
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
