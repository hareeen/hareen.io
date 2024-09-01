import { MainLayout } from '@/components/layout/MainLayout';
import { ProseArticle } from '@/components/layout/ProseArticle';
import Content from './content.mdx';

export default function LinksPage() {
  return (
    <MainLayout>
      <ProseArticle>
        <h2>연락처 및 링크</h2>
        <Content />
      </ProseArticle>
    </MainLayout>
  );
}
