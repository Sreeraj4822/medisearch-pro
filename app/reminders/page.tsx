'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, CalendarPlus, Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const reminderSchema = z.object({
  doctorName: z.string().min(1, 'Doctor name is required.'),
  checkupDate: z.date({ required_error: 'Checkup date is required.' }),
  notes: z.string().optional(),
});

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [startOfToday, setStartOfToday] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartOfToday(today);
    fetchReminders();
  }, []);

  async function fetchReminders() {
    const res = await fetch('/api/reminders');
    const data = await res.json();

    const formatted = data.map((r: any) => ({
      id: r.id,
      doctorName: r.title,
      checkupDate: new Date(r.reminder_date),
      notes: r.description,
    }));

    setReminders(formatted);
  }

  const form = useForm<z.infer<typeof reminderSchema>>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      doctorName: '',
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof reminderSchema>) {
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorName: values.doctorName,
        checkupDate: values.checkupDate,
        notes: values.notes,
      }),
    });

    await fetchReminders();
    form.reset();
    setShowForm(false);
  }

  async function deleteReminder(id: number) {
    await fetch('/api/reminders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    await fetchReminders();
  }

  const upcomingReminders = reminders.filter(
    (r) => differenceInDays(r.checkupDate, new Date()) >= 0
  );

  const pastReminders = reminders.filter(
    (r) => differenceInDays(r.checkupDate, new Date()) < 0
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Appointment Reminders"
        description="Track your upcoming doctor appointments."
      />

      <Alert>
        <CalendarPlus className="h-4 w-4" />
        <AlertTitle>Database Connected</AlertTitle>
        <AlertDescription>
          Reminders are now stored in MySQL and will persist after refresh.
        </AlertDescription>
      </Alert>

      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="self-start">
          <Plus className="mr-2" /> Add New Reminder
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add a New Reminder</CardTitle>
            <CardDescription>
              Fill in the details for your next appointment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="doctorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkupDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Checkup Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? format(field.value, 'PPP')
                                : 'Pick a date'}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < startOfToday}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Prescription or notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit">Save Reminder</Button>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* UPCOMING */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming</h2>
        {upcomingReminders.length > 0 ? (
          upcomingReminders.map((reminder) => {
            const daysLeft = differenceInDays(reminder.checkupDate, new Date());
            return (
              <Card key={reminder.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{reminder.doctorName}</CardTitle>
                  <CardDescription>
                    {format(reminder.checkupDate, 'PPP')}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <span>
                    {daysLeft === 0 ? 'Today' : `${daysLeft} days left`}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
}
