import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Deals endpoint' })
}

export async function POST() {
  return NextResponse.json({ message: 'Create deal endpoint' })
}
