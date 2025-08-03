import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Minimize2, Maximize2, Leaf, Camera, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: any;
}

interface UserContext {
  plantTypes: string[];
  gardeningStyle: string;
  region: string;
  preferences: any;
}

const SproutlyChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      // Add welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: "🌱 Hi there! I'm Sproutly, your friendly gardening assistant! I'm here to help with all your plant questions, from pest problems to planting schedules. What's growing in your garden today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = async (userMessage: string, context?: UserContext): Promise<string> => {
    // Simulate AI response with gardening knowledge
    const responses = [
      {
        keywords: ['tomato', 'tomatoes'],
        response: "🍅 Tomatoes are fantastic! They love warm weather and consistent watering. Make sure they get 6-8 hours of sunlight daily. Are you growing them in containers or in the ground? I can give you specific care tips based on your setup!"
      },
      {
        keywords: ['cucumber', 'cucumbers', 'white', 'leaves'],
        response: "🥒 White spots on cucumber leaves often indicate powdery mildew, especially in humid conditions. Try improving air circulation around your plants and avoid watering the leaves directly. You can also spray with a baking soda solution (1 tsp per quart of water). How widespread are the white spots?"
      },
      {
        keywords: ['carrots', 'sow', 'plant'],
        response: "🥕 Perfect timing question! Carrots prefer cool weather and can be direct sown. They need loose, well-draining soil. If you're in a temperate zone, you can plant them 2-3 weeks before your last frost date. What's your growing zone or location?"
      },
      {
        keywords: ['basil', 'tomato', 'companion'],
        response: "🌿 Yes! Basil and tomatoes are excellent companions! Basil can help repel certain pests that bother tomatoes, and many gardeners believe it improves tomato flavor. Plant basil around the base of your tomato plants or in nearby containers. Plus, you'll have fresh ingredients for pasta!"
      },
      {
        keywords: ['fertilizer', 'organic', 'roses'],
        response: "🌹 For organic rose feeding, I recommend compost, well-aged manure, or fish emulsion. Roses are heavy feeders and love rich, organic matter. You can also use banana peels (potassium) and coffee grounds (nitrogen) as supplements. When did you last feed your roses?"
      },
      {
        keywords: ['pest', 'holes', 'leaves', 'beans'],
        response: "🐛 Small holes in bean leaves often indicate flea beetles - tiny jumping insects that create a 'shot-hole' pattern. They're most active in early morning. Try row covers during peak season or spray with neem oil in the evening. Can you describe the size and pattern of the holes?"
      },
      {
        keywords: ['rain', 'water', 'herbs'],
        response: "🌧️ Great question! If your herbs are getting natural rainfall and the soil feels moist 1-2 inches down, you can skip watering. Most herbs prefer slightly dry conditions anyway. Check them after the rain stops - if the soil is still soggy in a few days, hold off on additional watering."
      }
    ];

    const userLower = userMessage.toLowerCase();
    
    for (const response of responses) {
      if (response.keywords.some(keyword => userLower.includes(keyword))) {
        return response.response;
      }
    }

    // Default responses based on context
    if (context?.plantTypes.length) {
      return `🌱 I see you're growing ${context.plantTypes.join(', ')}! That's wonderful. Could you tell me more about what specific help you need? I'm here to assist with watering, pests, diseases, or general care questions.`;
    }

    return "🌱 That's an interesting gardening question! While I'm still learning about that specific topic, I'd love to help you troubleshoot. Could you share more details about your setup? In the meantime, I recommend checking with your local extension office or experienced gardeners in your area for specialized advice.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(inputValue, userContext || undefined);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save conversation to Supabase if user is authenticated
      // This would require proper user authentication implementation
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-garden hover:bg-garden-hover transition-all duration-300 hover:scale-110 z-50"
        size="icon"
      >
        <Leaf className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 shadow-2xl border-garden/20 z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[600px]'
    }`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-garden/10 to-earth/10 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-garden">
              <AvatarFallback className="bg-garden text-white">
                <Leaf className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-garden">Sproutly</CardTitle>
              <Badge variant="secondary" className="text-xs bg-garden/10">
                Your Garden Assistant
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-garden text-white'
                        : 'bg-muted border border-garden/20'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 border border-garden/20">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse flex space-x-1">
                        <div className="h-2 w-2 bg-garden rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-garden rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-garden rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">Sproutly is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t border-garden/20">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your plants..."
                className="flex-1 border-garden/30 focus:border-garden"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="bg-garden hover:bg-garden-hover"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              🌱 Sproutly remembers your garden to give personalized advice
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SproutlyChat;