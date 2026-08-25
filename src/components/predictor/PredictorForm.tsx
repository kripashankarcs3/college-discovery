'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { PredictorInput } from '@/types/college'

interface PredictorFormProps {
  onSubmit: (input: PredictorInput) => void
}

export function PredictorForm({ onSubmit }: PredictorFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<PredictorInput>>({})
  const [error, setError] = useState('')

  const exams = ['JEE Main', 'JEE Advanced', 'NEET'] as const
  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'] as const

  const handleNext = () => {
    if (step === 1) {
      if (!formData.exam) {
        setError('Please select an exam')
        return
      }
      setStep(2)
      setError('')
    } else if (step === 2) {
      if (!formData.rank || formData.rank <= 0) {
        setError('Please enter a valid rank')
        return
      }
      setStep(3)
      setError('')
    } else if (step === 3) {
      if (!formData.category) {
        setError('Please select a category')
        return
      }

      const input: PredictorInput = {
        exam: formData.exam!,
        rank: formData.rank!,
        category: formData.category!,
      }
      onSubmit(input)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setError('')
    }
  }

  const handleChange = (field: keyof PredictorInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-electric text-navy-900' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-electric' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-slate-400 mt-2">
          <span>Select Exam</span>
          <span>Enter Rank</span>
          <span>Category</span>
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Select Entrance Exam</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <button
                key={exam}
                onClick={() => handleChange('exam', exam)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.exam === exam
                    ? 'border-electric bg-electric/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="font-semibold text-slate-100 mb-1">{exam}</div>
                <div className="text-sm text-slate-400">
                  {exam === 'JEE Main' ? 'For NITs, IIITs, GFTIs' : exam === 'JEE Advanced' ? 'For IITs' : 'For Medical Colleges'}
                </div>
              </button>
            ))}
          </div>
          {error && <p className="text-red-400">{error}</p>}
          <button
            onClick={handleNext}
            disabled={!formData.exam}
            className="w-full py-3 bg-electric hover:bg-blue-600 text-navy-900 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="inline ml-2 w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Enter Your Rank</h3>
          <div>
            <label className="block text-slate-400 mb-2">Your Rank</label>
            <input
              type="number"
              placeholder="e.g., 5000"
              value={formData.rank || ''}
              onChange={(e) => handleChange('rank', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
            />
          </div>
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!formData.rank}
              className="flex-1 py-3 bg-electric hover:bg-blue-600 text-navy-900 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="inline ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Select Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleChange('category', category)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.category === category
                    ? 'border-electric bg-electric/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="font-semibold text-slate-100 mb-1">{category}</div>
                <div className="text-sm text-slate-400">Category for reservation</div>
              </button>
            ))}
          </div>
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!formData.category}
              className="flex-1 py-3 bg-electric hover:bg-blue-600 text-navy-900 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Predict <ChevronRight className="inline ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-slate-800/30 rounded-lg text-sm text-slate-400">
        <strong>Disclaimer:</strong> Predictions are indicative and based on historical cutoff data. Actual admission
        depends on various factors including reservation policies and available seats.
      </div>
    </div>
  )
}
