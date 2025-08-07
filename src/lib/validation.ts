import { z, ZodError } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const messageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
  dueDate: z.coerce.date({ invalid_type_error: 'Due date is required' }),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type MessageForm = z.infer<typeof messageSchema>;
export type TaskForm = z.infer<typeof taskSchema>;

export function formatZodErrors<T>(error: ZodError<T>) {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const path = issue.path.join('.');
    if (!acc[path]) {
      acc[path] = issue.message;
    }
    return acc;
  }, {});
}
