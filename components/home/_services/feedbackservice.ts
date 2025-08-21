// src/services/feedbackservice.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';


export type Feedback = {
  id: string;
  name: string;
  role?: string | null;
  message: string;
  rating: number;           // 1..5
  created_at: string;
};

export type CreateFeedbackInput = {
  name: string;
  role?: string | null;
  message: string;
  rating: number;           // required 1..5
};

const supabase = createClient()

export async function saveFeedback(input: CreateFeedbackInput): Promise<Feedback> {
  const { data, error } = await supabase
    .from('feedbacks')
    .insert([{
      name: input.name,
      role: input.role ?? null,
      message: input.message,
      rating: input.rating,
    }])
    .select('*')
    .single();

  if (error) {
    const err = error as PostgrestError;
    throw new Error(err.message || 'Failed to save feedback');
  }
  return data as Feedback;
}

export async function getFeedbacks(): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    const err = error as PostgrestError;
    throw new Error(err.message || 'Failed to fetch feedbacks');
  }
  return data ?? [];
}

// ---- React Query hooks (TanStack Query v5 object syntax) ----
export function useGetFeedbacks(options?: { enabled?: boolean }) {
    return useQuery<Feedback[], Error>({
      queryKey: ['feedbacks'],
      queryFn: getFeedbacks,
      staleTime: 1000 * 60 * 5,
      retry: 1,
      enabled: options?.enabled ?? true,
    });
  }
  
  export function useSaveFeedback() {
    const qc = useQueryClient();
  
    return useMutation<Feedback, Error, CreateFeedbackInput>({
      mutationFn: async (input: CreateFeedbackInput) => {
        return await saveFeedback(input);
      },
      onSuccess: () => {
        // invalidate the feedbacks list on success
        qc.invalidateQueries({ queryKey: ['feedbacks'] });
      },
    });
  }
