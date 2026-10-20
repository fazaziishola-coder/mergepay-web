import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseFormSchema, type ExpenseFormValues } from '../lib/validation';
import { formatCurrencyAmount as formatStellarAmount } from '../lib/utils/currency';

interface ExpenseFormProps {
  onSubmit: (values: ExpenseFormValues) => void;
  initialValues?: Partial<ExpenseFormValues>;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, initialValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: initialValues?.description || '',
      amount: initialValues?.amount || '',
      currency: initialValues?.currency || 'XLM',
      paidBy: initialValues?.paidBy || '',
    },
  });

  const amountValue = watch('amount');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div>
        <label className="block font-bold mb-1">Description</label>
        <input
          {...register('description')}
          type="text"
          placeholder="Dinner, Groceries, etc."
          className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.description && (
          <p className="text-red-600 font-bold text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block font-bold mb-1">Amount</label>
        <input
          {...register('amount')}
          type="text"
          placeholder="0.00"
          className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        {amountValue && !errors.amount && (
          <p className="text-gray-600 text-xs mt-1">
            Formatted: {formatStellarAmount(amountValue)}
          </p>
        )}
        {errors.amount && (
          <p className="text-red-600 font-bold text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block font-bold mb-1">Currency</label>
        <select
          {...register('currency')}
          className="w-full p-2 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="XLM">XLM (Stellar Lumen)</option>
          <option value="USDC">USDC</option>
        </select>
        {errors.currency && (
          <p className="text-red-600 font-bold text-sm mt-1">{errors.currency.message}</p>
        )}
      </div>

      <div>
        <label className="block font-bold mb-1">Paid By</label>
        <input
          {...register('paidBy')}
          type="text"
          placeholder="Payer Public Key or Name"
          className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.paidBy && (
          <p className="text-red-600 font-bold text-sm mt-1">{errors.paidBy.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-yellow-300 font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5"
      >
        {isSubmitting ? 'Submitting...' : 'Create Expense'}
      </button>
    </form>
  );
};
