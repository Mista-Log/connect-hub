import { cn } from "@/lib/utils";
import { Check, CheckCheck, FileText, Download } from "lucide-react";

interface MessageProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "image" | "file";
  fileName?: string;
  fileSize?: string;
  imageUrl?: string;
}

const MessageBubble = ({
  content,
  timestamp,
  isOwn,
  status = "read",
  type = "text",
  fileName,
  fileSize,
  imageUrl,
}: MessageProps) => {
  const renderStatus = () => {
    if (!isOwn) return null;
    
    return (
      <span className={cn(
        "ml-1",
        status === "read" ? "text-primary" : "text-muted-foreground"
      )}>
        {status === "sent" ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <CheckCheck className="w-3.5 h-3.5" />
        )}
      </span>
    );
  };

  if (type === "image") {
    return (
      <div className={cn("flex", isOwn ? "justify-end" : "justify-start", "mb-3 animate-fade-in")}>
        <div className={cn(
          "max-w-[320px] rounded-2xl overflow-hidden",
          isOwn ? "bg-primary/10" : "bg-secondary"
        )}>
          <img 
            src={imageUrl} 
            alt="Shared image" 
            className="w-full h-auto object-cover"
          />
          <div className={cn(
            "flex items-center justify-end gap-1 px-3 py-2 text-xs",
            isOwn ? "text-primary" : "text-muted-foreground"
          )}>
            <span>{timestamp}</span>
            {renderStatus()}
          </div>
        </div>
      </div>
    );
  }

  if (type === "file") {
    return (
      <div className={cn("flex", isOwn ? "justify-end" : "justify-start", "mb-3 animate-fade-in")}>
        <div className={cn(
          "max-w-[320px] rounded-2xl p-3",
          isOwn 
            ? "gradient-primary text-primary-foreground" 
            : "bg-secondary text-foreground"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isOwn ? "bg-primary-foreground/20" : "bg-muted"
            )}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{fileName}</p>
              <p className={cn(
                "text-xs",
                isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {fileSize}
              </p>
            </div>
            <button className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              isOwn ? "hover:bg-primary-foreground/20" : "hover:bg-muted"
            )}>
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-1 mt-2 text-xs opacity-70">
            <span>{timestamp}</span>
            {renderStatus()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start", "mb-3 animate-fade-in")}>
      <div
        className={cn(
          "max-w-[70%] px-4 py-2.5 rounded-2xl",
          isOwn
            ? "gradient-primary text-primary-foreground rounded-br-md"
            : "bg-secondary text-foreground rounded-bl-md"
        )}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
        <div className={cn(
          "flex items-center justify-end gap-1 mt-1 text-xs",
          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          <span>{timestamp}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;