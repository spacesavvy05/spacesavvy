import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQItem } from '../data/posts';

interface FaqAccordionProps {
  items: FAQItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Build the JSON-LD schema dynamically
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="my-12 border-t border-stone-200 pt-12">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold font-mono block mb-2">
          Renter Insights & Guidance
        </span>
        <h3 className="text-2xl lg:text-3xl font-serif text-stone-900 mb-8 font-medium">
          Frequently Asked Spatial Questions
        </h3>

        <div className="divide-y divide-stone-200">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => toggleIndex(index)}
                  className="flex w-full items-center justify-between py-2 text-left text-base md:text-lg font-sans font-semibold text-stone-900 hover:text-amber-800 transition-colors group"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{item.question}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white group-hover:border-stone-300 transition-colors">
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5 text-stone-600" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-stone-600" />
                    )}
                  </span>
                </button>

                {/* Animated content expansion */}
                <div
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-sm md:text-base leading-relaxed text-stone-600 font-sans max-w-prose">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
