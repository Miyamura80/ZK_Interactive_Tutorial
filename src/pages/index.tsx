import Head from 'next/head';
import TreeDiagram from '../components/TreeDiagram';

const sampleData = {
  name: 'Root',
  children: [
    {
      name: 'Child 1',
      children: [
        { name: 'Grandchild 1' },
        { name: 'Grandchild 2' },
      ],
    },
    {
      name: 'Child 2',
      children: [
        { name: 'Grandchild 3' },
        { name: 'Grandchild 4' },
      ],
    },
  ],
};

export default function Home(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-10" style={{ backgroundColor: 'blue' }}>
      <Head>
        <title>Next.js with Tailwind CSS and D3.js Tree Diagram</title>
        <meta name="description" content="Next.js with Tailwind CSS and D3.js Tree Diagram" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl font-bold mb-4">
          Interactive and Live Updating Tree Diagram
        </h1>
        <div className="w-full max-w-4xl">
          <TreeDiagram data={sampleData} />
        </div>
      </main>
    </div>
  );
}
