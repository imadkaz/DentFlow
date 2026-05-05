import { Check } from "lucide-react";

export default function ProgressStepSection({ step }: { step: number }) {
    return(
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    num <= step
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {num < step ? <Check className="w-6 h-6" /> : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 transition-all ${
                      num < step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-24">
            <span className={`text-sm ${step >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}`}>
              Account
            </span>
            <span className={`text-sm ${step >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}`}>
              Practice
            </span>
            <span className={`text-sm ${step >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}`}>
              Plan
            </span>
          </div>
        </div>
    )
}