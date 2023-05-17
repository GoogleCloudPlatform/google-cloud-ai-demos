import React from 'react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

interface DemoThemingProps {
  children: React.ReactNode;
}

interface DemoSection {
  buttonText: string;
  title: string;
  element: React.ReactElement;
}

const DemoTheming = ({ children }: DemoThemingProps) => {
  return <div className="theme">{children}</div>;
};

interface DemoWrapperProps {
  title: string;
  subtitle: string;
  sections: DemoSection[];
  initialTabIndex?: number;
}

const DemoWrapper = ({ initialTabIndex, title, subtitle, sections }: DemoWrapperProps) => {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(initialTabIndex ?? 0);

  const handleChange = (newTab: number) => {
    if (newTab !== null) {
      setSelectedTabIndex(newTab);
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col space-y-8 p-4 mb-6 items-center justify-center">
        <article className="prose">
          <h1 className="text-center">{title}</h1>
          <p className="text-center">
            <ReactMarkdown linkTarget="_blank" children={subtitle} />
          </p>
        </article>
        <div className="self-center">
          <div className="btn-group">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => handleChange(index)}
                className={clsx('btn', index === selectedTabIndex ? 'btn-secondary' : '')}
              >
                {section.buttonText}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-grow bg-neutral-100">
        <div className="divider px-3 text-base">{sections[selectedTabIndex].title}</div>
        <div className="p-3 mt-3">
          <DemoTheming>{sections[selectedTabIndex].element}</DemoTheming>
        </div>
      </div>
    </div>
  );
};

export default DemoWrapper;
