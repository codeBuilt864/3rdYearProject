import { BrainCircuitIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

function CondensedMessages({ messages, maxFft = 0, className = "" }) {
  const { user } = useUser();

  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      {messages.map((message, index) => {
        const shouldAnimate = index === messages.length - 1 && maxFft > 0;

        return (
          <div
            key={index}
            className={`flex items-center gap-5 border border-[#7B5CFF]/30 pl-4 pr-6 py-4 rounded-xl max-w-3/4 ${
              message.isUser ? "self-end bg-[#7B5CFF]/10" : "self-start bg-[#A66CFF]/10"
            }`}
          >
            {message.isUser ? (
              <img
                src={user?.imageUrl}
                alt={user?.fullName}
                className="size-6 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="relative">
                <div
                  className={`absolute inset-0 border-[#7B5CFF]/40 border-4 rounded-full ${
                    shouldAnimate ? "animate-ping" : "hidden"
                  }`}
                />
                <BrainCircuitIcon
                  className="size-6 flex-shrink-0 relative text-[#A66CFF]"
                  style={shouldAnimate ? { scale: maxFft / 8 + 1 } : undefined}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              {message.content.map((text, i) => (
                <span key={i} className="text-white/90 text-sm">
                  {text}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CondensedMessages;
