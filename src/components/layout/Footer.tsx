export function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="my-4 print:hidden">
      <p className="md:text-sm text-xs text-muted-foreground font-medium">
        © {year} hareen aka Suyoung Hwang. All rights reserved. <br />
        <a className="hover:underline" href="https://x.com/_hareeen">
          X(Twitter)
        </a>
        {' · '}
        <a className="hover:underline" href="https://github.com/hareeen">
          Github
        </a>
        {' · '}
        <a className="hover:underline" href="mailto:me@hareen.io">
          Mail
        </a>
      </p>
    </div>
  );
}
