
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
import type { Reminder } from '@/lib/definitions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const reminderSchema = z.object({
  doctorName: z.string().min(1, 'Doctor name is required.'),
  checkupDate: z.date({ required_error: 'Checkup date is required.' }),
  notes: z.string().optional(),
});

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [startOfToday, setStartOfToday] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartOfToday(today);
  }, []);

  const form = useForm<z.infer<typeof reminderSchema>>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      doctorName: '',
      notes: '',
    },
  });

  function onSubmit(values: z.infer<typeof reminderSchema>) {
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      doctorName: values.doctorName,
      checkupDate: values.checkupDate,
      notes: values.notes || '',
    };
    setReminders((prev) => [...prev, newReminder].sort((a, b) => a.checkupDate.getTime() - b.checkupDate.getTime()));
    form.reset();
    setShowForm(false);
  }

  function deleteReminder(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }
  
  const upcomingReminders = reminders.filter(r => differenceInDays(r.checkupDate, new Date()) >= 0);
  const pastReminders = reminders.filter(r => differenceInDays(r.checkupDate, new Date()) < 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Appointment Reminders"
        description="Track your upcoming doctor appointments and prescriptions."
      />
      
      <Alert>
        <CalendarPlus className="h-4 w-4" />
        <AlertTitle>Feature Demo</AlertTitle>
        <AlertDescription>
          This is a demonstration. Reminders are not saved and will be lost on page refresh. To enable persistence, we can connect this to a database.
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
            <CardDescription>Fill in the details for your next appointment.</CardDescription>
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
                        <Input placeholder="e.g., Dr. Evelyn Reed" {...field} />
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
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < startOfToday}
                            initialFocus
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
                      <FormLabel>Prescription / Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Take Exaspirin twice a day..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="flex gap-2">
                    <Button type="submit">Save Reminder</Button>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                 </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h2 className="font-headline text-2xl font-bold">Upcoming Appointments</h2>
        {upcomingReminders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingReminders.map((reminder) => {
               const daysLeft = differenceInDays(reminder.checkupDate, new Date());
               return (
                <Card key={reminder.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{reminder.doctorName}</CardTitle>
                    <CardDescription>{format(reminder.checkupDate, 'EEEE, MMMM d, yyyy')}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {reminder.notes ? <p className="text-sm">{reminder.notes}</p> : <p className="text-sm text-muted-foreground">No notes added.</p>}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-sm font-semibold text-primary">
                      {daysLeft === 0 ? 'Today' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)}>
                        <Trash2 className="size-4 text-destructive" />
                        <span className="sr-only">Delete reminder</span>
                    </Button>
                  </CardFooter>
                </Card>
               )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">You have no upcoming appointments.</p>
        )}
      </div>
      
       <div className="space-y-6">
        <h2 className="font-headline text-2xl font-bold">Past Appointments</h2>
        {pastReminders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastReminders.map((reminder) => (
                <Card key={reminder.id} className="flex flex-col opacity-60">
                  <CardHeader>
                    <CardTitle>{reminder.doctorName}</CardTitle>
                    <CardDescription>{format(reminder.checkupDate, 'EEEE, MMMM d, yyyy')}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {reminder.notes ? <p className="text-sm">{reminder.notes}</p> : <p className="text-sm text-muted-foreground">No notes added.</p>}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)}>
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete reminder</span>
                    </Button>
                  </CardFooter>
                </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You have no past appointments.</p>
        )}
      </div>

    </div>
  );
}
