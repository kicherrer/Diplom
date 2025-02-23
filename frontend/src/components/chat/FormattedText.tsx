import React, { ReactNode } from 'react';
import { Typography, Link } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ComponentProps {
  children?: ReactNode;
  href?: string;
}

interface FormattedTextProps {
  text: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  const components: Partial<Components> = {
    p: ({ children }: ComponentProps) => (
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {children}
      </Typography>
    ),
    a: ({ href, children }: ComponentProps) => (
      <Link href={href || '#'} target="_blank" rel="noopener noreferrer">
        {children}
      </Link>
    ),
    strong: ({ children }: ComponentProps) => (
      <Typography component="strong" sx={{ fontWeight: 'bold' }}>
        {children}
      </Typography>
    ),
    em: ({ children }: ComponentProps) => (
      <Typography component="em" sx={{ fontStyle: 'italic' }}>
        {children}
      </Typography>
    ),
    code: ({ children }: ComponentProps) => (
      <Typography
        component="code"
        sx={{
          bgcolor: 'action.hover',
          p: 0.5,
          borderRadius: 1,
          fontFamily: 'monospace'
        }}
      >
        {children}
      </Typography>
    )
  };

  const MarkdownComponent = ReactMarkdown as React.ComponentType<{
    children: string;
    remarkPlugins: any[];
    components: Partial<Components>;
  }>;

  return (
    <div>
      <MarkdownComponent remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </MarkdownComponent>
    </div>
  );
};
