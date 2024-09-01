import { MainLayout } from '@/components/layout/MainLayout';
import { ProseArticle } from '@/components/layout/ProseArticle';
import { DividerVerticalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Content from './content.mdx';

export default function Home() {
  return (
    <MainLayout>
      <ProseArticle>
        <Content />

        <p className="space-x-2">
          <Link href="/cv">자세한 이력</Link>
          <DividerVerticalIcon className="inline w-4 h-4" />
          <Link href="/links">연락처 및 링크</Link>
          <DividerVerticalIcon className="inline w-4 h-4" />
          <Link href="/b">블로그 (공사 중)</Link>
        </p>
      </ProseArticle>
    </MainLayout>
  );
}
