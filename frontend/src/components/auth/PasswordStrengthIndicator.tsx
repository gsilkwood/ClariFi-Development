'use client';

interface PasswordStrengthIndicatorProps {
  strength: 'weak' | 'medium' | 'strong';
  errors?: string[];
}

export function PasswordStrengthIndicator({
  strength,
  errors = [],
}: PasswordStrengthIndicatorProps) {
  const colors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  const labels = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  };

  return (
    <div className="w-full mt-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors[strength]} transition-all`}
            style={{ width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%' }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">{labels[strength]}</span>
      </div>
      {errors.length > 0 && (
        <ul className="text-sm text-gray-600">
          {errors.map((error, idx) => (
            <li key={idx} className="text-red-500">
              • {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
