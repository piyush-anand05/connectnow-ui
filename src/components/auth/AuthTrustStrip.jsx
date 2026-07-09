import { ShieldCheck, MapPinned, MessageCircle, EyeOff } from "lucide-react";

const trustItems = [
  { icon: MapPinned, label: "City-aware discovery" },
  { icon: MessageCircle, label: "Connection-first messaging" },
  { icon: ShieldCheck, label: "Report and block controls" },
  { icon: EyeOff, label: "No public phone number required" },
];

export default function AuthTrustStrip() {
  return (
    <div className="auth-trust-strip">
      {trustItems.map((item) => {
        const Icon = item.icon;
        return (
          <span key={item.label}>
            <Icon size={14} />
            {item.label}
          </span>
        );
      })}
    </div>
  );
}
