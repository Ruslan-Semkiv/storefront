import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// All details below are made up for the test store.
const blocks = [
  {
    icon: Mail,
    title: 'Email',
    lines: [
      { label: 'Customer care', value: 'hello@verdantsteps.example', href: 'mailto:hello@verdantsteps.example' },
      { label: 'Returns', value: 'returns@verdantsteps.example', href: 'mailto:returns@verdantsteps.example' },
    ],
  },
  {
    icon: Phone,
    title: 'Phone',
    lines: [
      { label: 'Ukraine', value: '+380 32 555 0142', href: 'tel:+380325550142' },
      { label: 'EU', value: '+48 22 555 0177', href: 'tel:+48225550177' },
    ],
  },
  {
    icon: MapPin,
    title: 'Flagship store',
    lines: [
      { label: 'Address', value: '12 Leather Lane, Lviv 79000, Ukraine' },
      { label: 'Warehouse', value: 'Unit 4, Green Park, Kraków 30-001, Poland' },
    ],
  },
  {
    icon: Clock,
    title: 'Opening hours',
    lines: [
      { label: 'Mon–Fri', value: '10:00 – 20:00' },
      { label: 'Sat–Sun', value: '11:00 – 18:00' },
    ],
  },
] as const;

export function ContactInfo() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {blocks.map(({ icon: Icon, title, lines }) => (
        <Card key={title}>
          <CardContent className="space-y-3 p-6">
            <h2 className="flex items-center gap-2 font-medium">
              <Icon aria-hidden className="size-5 text-muted-foreground" />
              {title}
            </h2>
            <dl className="space-y-2 text-sm">
              {lines.map((line) => (
                <div key={line.label}>
                  <dt className="text-muted-foreground">{line.label}</dt>
                  <dd>
                    {'href' in line ? (
                      <a href={line.href} className="underline-offset-4 hover:underline">{line.value}</a>
                    ) : (
                      line.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
