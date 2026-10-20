import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title (H1)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Small Space Living', value: 'Small Space Living' },
          { title: 'Kitchen & Dining', value: 'Kitchen & Dining' },
          { title: 'Compact Workspaces', value: 'Compact Workspaces' },
          { title: 'Curated Amazon Finds', value: 'Curated Amazon Finds' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (e.g. 6 min read)',
      type: 'string',
      initialValue: '6 min read',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'takeaway',
      title: 'The SpaceSavvy Takeaway (Yellow Highlight Box)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text (For Google & Pinterest SEO)',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Meta Title (For Google Search)',
      type: 'string',
      description: 'Keep under 60 characters. Leave blank to use Post Title.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description (Excerpt)',
      type: 'text',
      rows: 2,
      description: '140-160 characters summarizing the article for Google.',
    }),
    defineField({
      name: 'body',
      title: 'Article Content (Paste your whole blog here, add images & Amazon cards inline)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal Paragraph', value: 'normal' },
            { title: 'H2 (Main Section Heading - Shows in Table of Contents)', value: 'h2' },
            { title: 'H3 (Subheading)', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
        {
          type: 'image',
          title: 'Inline Photo',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Photo Alt Text (Pinterest SEO)', type: 'string' },
          ],
        },
        {
          type: 'object',
          name: 'productCard',
          title: 'Amazon Product Card',
          fields: [
            { name: 'productName', title: 'Product Name', type: 'string' },
            { name: 'price', title: 'Price (e.g. $29.99)', type: 'string' },
            { name: 'dimensions', title: 'Dimensions / Key Spec', type: 'string' },
            { name: 'material', title: 'Material', type: 'string' },
            { name: 'rating', title: 'Rating (e.g. 4.8/5)', type: 'string', initialValue: '4.7/5' },
            { name: 'affiliateUrl', title: 'Amazon Affiliate Link', type: 'url' },
            { name: 'productImage', title: 'Product White-BG Photo', type: 'image' },
          ],
        },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs (Optional)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' },
          ],
        },
      ],
    }),
  ],
});