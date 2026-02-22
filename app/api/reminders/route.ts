import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

/* GET all reminders */
export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reminders ORDER BY reminder_date ASC'
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error('GET ERROR:', error)
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 })
  }
}

/* INSERT reminder */
export async function POST(req: Request) {
  try {
    const { doctorName, checkupDate, notes } = await req.json()

    const formattedDate = new Date(checkupDate)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')

    await pool.query(
      `INSERT INTO reminders (title, description, reminder_date)
       VALUES (?, ?, ?)`,
      [doctorName, notes || '', formattedDate]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST ERROR:', error)
    return NextResponse.json({ error: 'Failed to insert reminder' }, { status: 500 })
  }
}

/* DELETE reminder */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await pool.query('DELETE FROM reminders WHERE id = ?', [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE ERROR:', error)
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 })
  }
}