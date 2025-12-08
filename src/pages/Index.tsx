import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Users, Shield, Zap, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Send,
      title: "Instant Messaging",
      description: "Send and receive messages in real-time with lightning-fast delivery.",
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create teams and groups to collaborate with multiple people at once.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption keeps your conversations safe and private.",
    },
    {
      icon: Zap,
      title: "File Sharing",
      description: "Share images, documents, and files seamlessly within conversations.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <header className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl animate-float" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              Pulse<span className="text-gradient">Chat</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button variant="gradient" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-online animate-pulse" />
            <span className="text-sm text-muted-foreground">Now with real-time presence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 animate-slide-up">
            Connect. Share.
            <br />
            <span className="text-gradient">Communicate.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            A modern communication platform for seamless messaging, file sharing, and collaboration with friends and teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="gradient" size="xl" onClick={() => navigate("/auth")} className="group">
              Start Chatting Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="xl" onClick={() => navigate("/chat")}>
              View Demo
            </Button>
          </div>

          {/* Preview Card */}
          <div className="mt-20 relative animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl rounded-3xl" />
            <div className="relative glass rounded-3xl p-2 shadow-elevated max-w-4xl mx-auto">
              <div className="bg-card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <div className="w-3 h-3 rounded-full bg-online" />
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">PulseChat</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">JD</div>
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5 max-w-xs">
                      <p className="text-sm">Hey team! The new features are ready for review 🚀</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="gradient-primary rounded-2xl rounded-br-md px-4 py-2.5 max-w-xs">
                      <p className="text-sm text-primary-foreground">That's amazing! Let me check them out right now.</p>
                    </div>
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-medium text-primary-foreground">SW</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Everything you need to stay connected
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make communication effortless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-6 hover:bg-secondary/50 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who are already enjoying seamless communication.
              </p>
              <Button variant="gradient" size="xl" onClick={() => navigate("/auth")} className="group">
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">PulseChat</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 PulseChat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;