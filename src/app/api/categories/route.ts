import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 获取所有分类
export async function GET() {
    try {
        const categories = await prisma.category.findMany()
        return NextResponse.json(categories)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

// POST: 创建新分类
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug } = body

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
            },
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}
