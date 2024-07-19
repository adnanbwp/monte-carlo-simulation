import React from 'react';
import { Download } from 'lucide-react';

const CSVTemplate: React.FC = () => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = process.env.PUBLIC_URL + '/sample_project_data.csv';
    link.download = 'sample_project_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="text-blue-600 hover:text-blue-800 flex items-center"
    >
      <Download className="mr-1" size={18} />
      Download CSV Template
    </button>
  );
};

export default CSVTemplate;