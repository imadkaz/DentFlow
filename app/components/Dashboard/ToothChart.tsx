import { useState } from 'react';

interface Tooth {
  id: number;
  status: 'healthy' | 'treatment' | 'completed';
  label: string;
}

// Universal tooth numbering system (1-32)
const initialTeeth: Tooth[] = [
  // Upper Right (1-8)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    label: `${i + 1}`,
    status: i === 2 ? 'treatment' : i === 5 ? 'completed' : 'healthy',
  })),
  // Upper Left (9-16)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 9,
    label: `${i + 9}`,
    status: i === 3 ? 'treatment' : 'healthy',
  })),
  // Lower Left (17-24)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 17,
    label: `${i + 17}`,
    status: i === 6 ? 'completed' : 'healthy',
  })),
  // Lower Right (25-32)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 25,
    label: `${i + 25}`,
    status: i === 1 ? 'treatment' : i === 4 ? 'completed' : 'healthy',
  })),
] as Tooth[];

const statusColors = {
  healthy: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-400',
    hover: 'hover:bg-emerald-100',
    text: 'text-emerald-700',
  },
  treatment: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    hover: 'hover:bg-amber-100',
    text: 'text-amber-700',
  },
  completed: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    hover: 'hover:bg-blue-100',
    text: 'text-blue-700',
  },
};

export function ToothChart() {
  const [teeth, setTeeth] = useState<Tooth[]>(initialTeeth);
  const [selectedTooth, setSelectedTooth] = useState<Tooth | null>(null);

  const handleToothClick = (tooth: Tooth) => {
    setSelectedTooth(tooth);
  };

  const ToothComponent = ({ tooth }: { tooth: Tooth }) => {
    const colors = statusColors[tooth.status];
    const isSelected = selectedTooth?.id === tooth.id;

    return (
      <button
        onClick={() => handleToothClick(tooth)}
        className={`relative w-8 h-11 ${colors.bg} ${colors.border} border-2 rounded-lg ${colors.hover} transition-all cursor-pointer flex items-center justify-center ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : ''
        }`}
        title={`Tooth #${tooth.label}`}
      >
        <span className={`text-xs font-semibold ${colors.text}`}>
          {tooth.label}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tooth Chart</h3>
        <p className="text-sm text-gray-600">Click on any tooth to view details</p>
      </div>

      {/* Tooth Chart Grid */}
      <div className="space-y-8">
        {/* Upper Teeth */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 text-center mb-3">Upper Teeth</p>
          <div className="flex justify-center gap-1  pb-2">
            {/* Upper Right */}
            <div className="flex gap-1">
              {teeth.slice(0, 8).reverse().map((tooth) => (
                <ToothComponent key={tooth.id} tooth={tooth} />
              ))}
            </div>
            <div className="w-4"></div>
            {/* Upper Left */}
            <div className="flex gap-1">
              {teeth.slice(8, 16).map((tooth) => (
                <ToothComponent key={tooth.id} tooth={tooth} />
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-300"></div>

        {/* Lower Teeth */}
        <div className="space-y-2">
          <div className="flex justify-center gap-1">
            {/* Lower Right */}
            <div className="flex gap-1">
              {teeth.slice(24, 32).reverse().map((tooth) => (
                <ToothComponent key={tooth.id} tooth={tooth} />
              ))}
            </div>
            <div className="w-4"></div>
            {/* Lower Left */}
            <div className="flex gap-1">
              {teeth.slice(16, 24).map((tooth) => (
                <ToothComponent key={tooth.id} tooth={tooth} />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">Lower Teeth</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-50 border-2 border-emerald-400 rounded"></div>
          <span className="text-sm text-gray-600">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-50 border-2 border-amber-400 rounded"></div>
          <span className="text-sm text-gray-600">Treatment Needed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-400 rounded"></div>
          <span className="text-sm text-gray-600">Completed</span>
        </div>
      </div>

      {/* Selected Tooth Info */}
      {selectedTooth && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Tooth #{selectedTooth.label}
          </p>
          <p className="text-sm text-gray-600">
            Status: <span className="font-medium capitalize">{selectedTooth.status.replace('-', ' ')}</span>
          </p>
        </div>
      )}
    </div>
  );
}
