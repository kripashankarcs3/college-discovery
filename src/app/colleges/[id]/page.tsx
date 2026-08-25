import { notFound } from 'next/navigation'
import { CollegeHero, CollegeTabs } from '@/components/college'
import { PageTransition } from '@/components/shared'
import { colleges } from '@/lib/data/colleges'

interface CollegePageProps {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: CollegePageProps) {
  const college = colleges.find((c) => c.id === params.id)

  if (!college) {
    return {
      title: 'College Not Found',
    }
  }

  return {
    title: `${college.name} - College Details`,
    description: college.about.substring(0, 160),
  }
}

export default function CollegePage({ params }: CollegePageProps) {
  const college = colleges.find((c) => c.id === params.id)

  if (!college) {
    notFound()
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <CollegeHero college={college} />
        <CollegeTabs college={college} />
      </div>
    </PageTransition>
  )
}
