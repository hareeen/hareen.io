'use client';

const UtterancesComments = (props: { theme: string }) => (
  <section
    ref={(elem) => {
      if (!elem || document.visibilityState === 'hidden') {
        return;
      }

      const scriptElem = document.createElement('script');
      scriptElem.src = 'https://utteranc.es/client.js';
      scriptElem.async = true;
      scriptElem.crossOrigin = 'anonymous';
      scriptElem.setAttribute('repo', 'hareeen/utterances');
      scriptElem.setAttribute('issue-term', 'pathname');
      scriptElem.setAttribute('theme', props.theme);
      
      if (elem.firstChild) elem.removeChild(elem.firstChild);
      elem.appendChild(scriptElem);
    }}
  />
);

export function Comments() {
  return (
    <div>
      <div className="block dark:hidden">
        <UtterancesComments theme="github-light" />
      </div>
      <div className="hidden dark:block">
        <UtterancesComments theme="github-dark" />
      </div>
    </div>
  );
}
