import { CheckCircle2, Circle, Clock, DollarSign } from 'lucide-react';

interface TreatmentStage {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  date?: string;
}

interface InstallmentPayment {
  id: number;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

const treatmentStages: TreatmentStage[] = [
  {
    id: 1,
    name: 'Initial Consultation',
    status: 'completed',
    date: 'Jan 15, 2026',
  },
  {
    id: 2,
    name: 'X-Ray & Diagnosis',
    status: 'completed',
    date: 'Jan 18, 2026',
  },
  {
    id: 3,
    name: 'Root Canal Treatment',
    status: 'in-progress',
    date: 'Feb 20, 2026',
  },
  {
    id: 4,
    name: 'Crown Placement',
    status: 'pending',
  },
  {
    id: 5,
    name: 'Follow-up Checkup',
    status: 'pending',
  },
];

const installments: InstallmentPayment[] = [
  {
    id: 1,
    amount: 500,
    dueDate: 'Jan 15, 2026',
    status: 'paid',
  },
  {
    id: 2,
    amount: 500,
    dueDate: 'Feb 15, 2026',
    status: 'paid',
  },
  {
    id: 3,
    amount: 500,
    dueDate: 'Mar 15, 2026',
    status: 'pending',
  },
  {
    id: 4,
    amount: 500,
    dueDate: 'Apr 15, 2026',
    status: 'pending',
  },
];

export function TreatmentPlanPanel() {
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const paidAmount = installments
    .filter((inst) => inst.status === 'paid')
    .reduce((sum, inst) => sum + inst.amount, 0);
  const progress = (paidAmount / totalAmount) * 100;

  return (
    <div className="space-y-6">
      {/* Treatment Stages */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Active Treatment Plan
        </h3>

        <div className="space-y-4">
          {treatmentStages.map((stage, index) => {
            const isLast = index === treatmentStages.length - 1;

            return (
              <div key={stage.id} className="relative">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="relative flex-shrink-0">
                    {stage.status === 'completed' ? (
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                    ) : stage.status === 'in-progress' ? (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Circle className="w-5 h-5 text-gray-400" />
                      </div>
                    )}

                    {/* Connecting Line */}
                    {!isLast && (
                      <div
                        className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 ${
                          stage.status === 'completed'
                            ? 'bg-emerald-300'
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1 pt-1">
                    <h4 className="font-medium text-gray-900">{stage.name}</h4>
                    {stage.date && (
                      <p className="text-sm text-gray-500 mt-1">{stage.date}</p>
                    )}
                    {stage.status === 'in-progress' && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Installments */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Installments
          </h3>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">
              ${paidAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              of ${totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Payment Progress</span>
            <span className="font-medium text-gray-900">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Installment List */}
        <div className="space-y-3">
          {installments.map((installment) => (
            <div
              key={installment.id}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                installment.status === 'paid'
                  ? 'bg-emerald-50 border-emerald-200'
                  : installment.status === 'overdue'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    installment.status === 'paid'
                      ? 'bg-emerald-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <DollarSign
                    className={`w-5 h-5 ${
                      installment.status === 'paid'
                        ? 'text-emerald-600'
                        : 'text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Installment #{installment.id}
                  </p>
                  <p className="text-sm text-gray-500">Due: {installment.dueDate}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${installment.amount}
                </p>
                <span
                  className={`text-xs font-medium ${
                    installment.status === 'paid'
                      ? 'text-emerald-600'
                      : installment.status === 'overdue'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {installment.status === 'paid'
                    ? 'Paid'
                    : installment.status === 'overdue'
                    ? 'Overdue'
                    : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
