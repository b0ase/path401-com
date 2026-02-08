import { readFileSync } from 'fs';
import { join } from 'path';
import { SpecContent } from './SpecContent';

export const metadata = {
  title: '$401 Specification — Identity Token Standard',
  description: 'Technical specification for the $401 Identity Token: self-sovereign identity, peer underwriting, trust scores, and agent identity on BSV.',
};

export default function SpecPage() {
  const specPath = join(process.cwd(), 'content', 'spec.md');
  const markdown = readFileSync(specPath, 'utf-8');

  return <SpecContent markdown={markdown} />;
}
