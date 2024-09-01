import { MainLayout } from '@/components/layout/MainLayout';
import { ProseArticle } from '@/components/layout/ProseArticle';
import { DividerVerticalIcon } from '@radix-ui/react-icons';
import type { Metadata } from 'next';
import Link from 'next/link';
import Content from './content.mdx';

export const metadata: Metadata = {
  title: '황수영 Suyoung Hwang',
  description: '이력서 - 황수영 Suyoung Hwang',
};

const TEL: string | undefined = undefined;

export default function CvPage() {
  return (
    <MainLayout>
      <ProseArticle>
        <h2 className="print:hidden">이력</h2>
        <h2 className="hidden print:block print:mb-2">황수영 Suyoung Hwang</h2>
        <p className="space-x-1.5 hidden print:block text-sm">
          <Link href="mailto:me@hareen.io">me@hareen.io</Link>
          <DividerVerticalIcon className="inline w-[0.875rem] h-[0.875rem]" />
          <Link href="mailto:sy_h@yonsei.ac.kr">sy_h@yonsei.ac.kr</Link>
          {TEL && (
            <>
              <DividerVerticalIcon className="inline w-[0.875rem] h-[0.875rem]" />
              <Link href={`tel:${TEL}`}>{TEL}</Link>
            </>
          )}
        </p>
        <Content />
      </ProseArticle>
    </MainLayout>
  );
}
