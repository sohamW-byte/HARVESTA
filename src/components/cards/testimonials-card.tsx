
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const testimonials = [
  {
    name: "Ramesh Patel",
    location: "Punjab, India",
    quote: "Harvesta's marketplace connected me directly with buyers in Mumbai. I got 20% better prices for my wheat this season!",
    avatar: "https://picsum.photos/seed/farmer1/100/100",
  },
  {
    name: "Priya Rao",
    location: "Maharashtra, India",
    quote: "The AI suggestions for crop rotation were a game-changer. My soil health has improved, and I'm seeing better yields for my sugarcane.",
    avatar: "https://picsum.photos/seed/farmer2/100/100",
  },
  {
    name: "Anand Kumar",
    location: "Karnataka, India",
    quote: "Finally, a platform that understands farmers. The live price board helped me decide the best time to sell my coffee beans.",
    avatar: "https://picsum.photos/seed/farmer3/100/100",
  },
];

export function TestimonialsCard() {
  const { t } = useTranslation();
  return (
    <Card className="rounded-2xl h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t('Voices from the Field')}</CardTitle>
        <CardDescription>
          {t('Hear what our community of farmers has to say.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-lg"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                    <div className="flex flex-col items-center text-center gap-4 p-6">
                        <Quote className="h-8 w-8 text-primary" />
                        <p className="text-lg font-medium italic">
                            "{t(testimonial.quote)}"
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <Avatar>
                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}
